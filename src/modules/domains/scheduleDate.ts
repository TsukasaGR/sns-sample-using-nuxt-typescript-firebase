import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import { dayjsFromNow, dayjsFromFirestoreTimestamp } from '~/modules/dayjs'
import { scheduleDatesOfGoal } from '~/modules/firebase/firestore/scheduleDates'
import { recordsOfGoal } from '~/modules/firebase/firestore/records'
import { retrospectivesOfGoal } from '~/modules/firebase/firestore/retrospectives'
import { isPublished } from '~/modules/domains/goal'

type BaseData = {
  collections: (types.Record | types.Retrospective)[]
  scheduleDates: types.ScheduleDate[]
}

/**
 * スケジュール関連のロジックに必要な基本データを取得
 * @param goal
 * @param scheduleType
 */
async function baseData(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<BaseData> {
  let collections: (types.Record | types.Retrospective)[] = []
  let scheduleDates: types.ScheduleDate[] = []

  const promiseCollections =
    scheduleType === 'record'
      ? recordsOfGoal(goal.objectID).then(res => (collections = res))
      : retrospectivesOfGoal(goal.objectID).then(res => (collections = res))
  const promiseScheduleDates = scheduleDatesOfGoal(goal.objectID).then(
    res => (scheduleDates = res)
  )

  await Promise.all([promiseCollections, promiseScheduleDates])
  scheduleDates = scheduleDates.filter(
    scheduleDate => scheduleDate.scheduleType === scheduleType
  )
  return { collections, scheduleDates }
}

/**
 * 未来のスケジュール取得
 * @param goal
 * @param scheduleType
 */
async function futureScheduleDates(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<types.ScheduleDate[]> {
  const base = await baseData(goal, scheduleType)
  const collections = base.collections
  const scheduleDates = base.scheduleDates

  return scheduleDates.filter(scheduleDate => {
    return (
      scheduleDate.scheduleType === scheduleType &&
      dayjsFromNow().diff(
        dayjsFromFirestoreTimestamp(scheduleDate.scheduleAt)
      ) < 0 &&
      !collections.find(
        collection => collection.scheduleDateId === scheduleDate.objectID
      )
    )
  })
}

/**
 * 未来直近3回分のスケジュール取得
 * @param goal
 * @param scheduleType
 */
async function nextThreeScheduleDates(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<types.ScheduleDate[]> {
  const scheduleDates = await futureScheduleDates(goal, scheduleType)
  return sortScheduleDates(scheduleDates.slice(0, 3))
}

/**
 * 期限切れのスケジュール取得
 * @param goal
 * @param scheduleType
 */
export async function expiredScheduleDates(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<types.ScheduleDate[]> {
  const base = await baseData(goal, scheduleType)
  const collections = base.collections
  const scheduleDates = base.scheduleDates

  const expiredScheduleDates = scheduleDates.filter(scheduleDate => {
    return (
      !collections.find(
        collection => collection.scheduleDateId === scheduleDate.objectID
      ) &&
      dayjsFromNow().diff(
        dayjsFromFirestoreTimestamp(scheduleDate.scheduleAt)
      ) > 0
    )
  })

  return sortScheduleDates(expiredScheduleDates, 'desc')
}

/**
 * 次回スケジュール取得
 * @param goal
 * @param scheduleType
 */
export async function nextScheduleDate(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<types.ScheduleDate | null> {
  const futureDates = await futureScheduleDates(goal, scheduleType)

  return futureDates.length > 0 ? sortScheduleDates(futureDates)[0] : null
}

/**
 * Record作成時に選択可能なスケジュール取得
 * @param goal
 */
export async function canCreateRecordsOfScheduleDate(
  goal: types.Goal
): Promise<types.ScheduleDate[]> {
  let expiredDates: types.ScheduleDate[] = []
  let nextDates: types.ScheduleDate[] = []
  const promiseExpiredDates = await expiredScheduleDates(goal, 'record').then(
    res => (expiredDates = res)
  )
  const promiseNextDates = await nextThreeScheduleDates(goal, 'record').then(
    res => (nextDates = res)
  )
  await Promise.all([promiseExpiredDates, promiseNextDates])
  return sortScheduleDates(expiredDates.concat(nextDates))
}

/**
 * Retrospective作成時に選択可能なスケジュール取得
 * @param goal
 */
export async function canCreateRetrospectivesOfScheduleDate(
  goal: types.Goal
): Promise<types.ScheduleDate[]> {
  let expiredDates: types.ScheduleDate[] = []
  let nextDates: types.ScheduleDate[] = []
  const promiseExpiredDates = await expiredScheduleDates(
    goal,
    'retrospective'
  ).then(res => (expiredDates = res))
  const promiseNextDates = await nextThreeScheduleDates(
    goal,
    'retrospective'
  ).then(res => (nextDates = res))
  await Promise.all([promiseExpiredDates, promiseNextDates])
  return expiredDates.concat(nextDates)
}

/**
 * リアルタイムデータ同期用：期限切れスケジュール取得
 * @param scheduleDates
 * @param records
 * @param retrospectives
 */
export function expiredScheduleDatesForRealTime(
  scheduleDates: types.ScheduleDate[],
  goals: types.Goal[],
  records: types.Record[],
  retrospectives: types.Retrospective[]
): types.ScheduleDate[] {
  const expiredScheduleDates = scheduleDates.filter(scheduleDate => {
    const targetCollections =
      scheduleDate.scheduleType === 'record' ? records : retrospectives
    return (
      !targetCollections.find(
        targetCollection =>
          targetCollection.scheduleDateId === scheduleDate.objectID
      ) &&
      dayjsFromNow().diff(
        dayjsFromFirestoreTimestamp(scheduleDate.scheduleAt)
      ) > 0 &&
      goals.find(
        goal => goal.objectID === scheduleDate.goalId && isPublished(goal)
      )
    )
  })

  return sortScheduleDates(expiredScheduleDates, 'desc')
}

/**
 * 記録,振り返りされていないすべてのスケジュールを取得
 * @param goal
 * @param scheduleType
 */
export async function undoneScheduleDates(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<types.ScheduleDate[]> {
  const base = await baseData(goal, scheduleType)
  const collections = base.collections
  const scheduleDates = base.scheduleDates

  const undoneScheduleDates = scheduleDates.filter(scheduleDate => {
    return !collections.find(
      collection => collection.scheduleDateId === scheduleDate.objectID
    )
  })

  return sortScheduleDates(undoneScheduleDates, 'desc')
}

/**
 * スケジュール日によるソート
 * @param scheduleDates
 * @param sortOrder
 */
export function sortScheduleDates(
  scheduleDates: types.ScheduleDate[],
  sortOrder: appTypes.SortOrder = 'asc'
): types.ScheduleDate[] {
  scheduleDates.sort((a, b) => {
    if (sortOrder === 'desc') {
      if (a.scheduleAt.seconds > b.scheduleAt.seconds) return -1
      if (a.scheduleAt.seconds < b.scheduleAt.seconds) return 1
      return 0
    } else {
      if (a.scheduleAt.seconds < b.scheduleAt.seconds) return -1
      if (a.scheduleAt.seconds > b.scheduleAt.seconds) return 1
      return 0
    }
  })
  return scheduleDates
}
