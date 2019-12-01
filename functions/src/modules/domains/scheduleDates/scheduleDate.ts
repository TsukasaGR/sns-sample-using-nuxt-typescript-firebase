import * as dayjs from 'dayjs'
import * as types from '../../../types'
import * as appTypes from '../../../applicationTypes'
import firebase from '../../initializeFirebaseApp'
import { dayjsFromNow } from '../../dayjs'

type BaseData = {
  collections: (types.Record | types.Retrospective)[]
  scheduleDates: types.ScheduleDate[]
}

const firestore = firebase.firestore()
const scheduleDatesCollection = firestore.collection('scheduleDates')
const recordsCollection = firestore.collection('records')
const retrospectivesCollection = firestore.collection('retrospectives')

export async function scheduleDatesOfGoal(
  goalId: string
): Promise<types.ScheduleDate[]> {
  const scheduleDates: types.ScheduleDate[] = []
  await scheduleDatesCollection
    .where('goalId', '==', goalId)
    .get()
    .then(query => {
      query.forEach(doc => {
        scheduleDates.push(doc.data() as types.ScheduleDate)
      })
    })
  return scheduleDates
}

export async function recordsOfGoal(goalId: string): Promise<types.Record[]> {
  const records: types.Record[] = []
  await recordsCollection
    .where('goalId', '==', goalId)
    .get()
    .then(query => {
      query.forEach(doc => {
        records.push(doc.data() as types.Record)
      })
    })
  return records
}

export async function retrospectivesOfGoal(
  goalId: string
): Promise<types.Retrospective[]> {
  const retrospectives: types.Retrospective[] = []
  await retrospectivesCollection
    .where('goalId', '==', goalId)
    .get()
    .then(query => {
      query.forEach(doc => {
        retrospectives.push(doc.data() as types.Retrospective)
      })
    })
  return retrospectives
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
      dayjsFromNow().diff(dayjs(scheduleDate.scheduleAt.toDate())) < 0 &&
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
      ) && dayjsFromNow().diff(dayjs(scheduleDate.scheduleAt.toDate())) > 0
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
      ) && dayjsFromNow().diff(dayjs(scheduleDate.scheduleAt.toDate())) > 0
    )
  })

  return sortScheduleDates(expiredScheduleDates, 'desc')
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
