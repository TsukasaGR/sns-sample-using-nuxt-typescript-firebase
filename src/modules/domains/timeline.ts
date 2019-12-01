import * as types from '~/types/domainTypes'
import { all as allGoals } from '~/modules/firebase/firestore/goals'
import { all as allRecords } from '~/modules/firebase/firestore/records'
import { all as allRetrospectives } from '~/modules/firebase/firestore/retrospectives'
import { isDraft } from '~/modules/domains/goal'

type TimelineData = {
  goals: types.Goal[]
  records: types.Record[]
  retrospectives: types.Retrospective[]
}

export async function timeline(): Promise<types.Timeline[]> {
  const timelineData = await getData()

  const goals = timelineData.goals.filter(goal => !isDraft(goal)) // 下書きは除外する
  const records = timelineData.records.filter(() => true) // ひとまず全件
  const retrospectives = timelineData.retrospectives.filter(() => true) // ひとまず全件

  const timelineGoals: types.TimelineGoal[] = goals.map(goal => {
    return { ...goal, timelineType: 'goal' }
  })
  const timelineRecords: types.TimelineRecord[] = records.map(record => {
    return { ...record, timelineType: 'record' }
  })
  const timelineRetrospectives: types.TimelineRetrospective[] = retrospectives.map(
    retrospective => {
      return { ...retrospective, timelineType: 'retrospective' }
    }
  )

  return [...timelineGoals, ...timelineRecords, ...timelineRetrospectives].sort(
    (a, b) => {
      if (a.createdAt > b.createdAt) return -1
      if (a.createdAt < b.createdAt) return 1
      return 0
    }
  )
}

export async function timelineOfUser(
  userId: string
): Promise<types.Timeline[]> {
  const timelineArray: types.Timeline[] = await timeline()
  return timelineArray.filter(tl => {
    return tl.userId === userId && tl.timelineType !== 'goal'
  })
}

function getData(): Promise<TimelineData> {
  let goals: types.Goal[] = []
  let records: types.Record[] = []
  let retrospectives: types.Retrospective[] = []
  const promiseGaols = allGoals().then(res => (goals = res))
  const promiseRecords = allRecords().then(res => (records = res))
  const promiseRetrospectives = allRetrospectives().then(
    res => (retrospectives = res)
  )

  return Promise.all([
    promiseGaols,
    promiseRecords,
    promiseRetrospectives,
  ]).then(() => {
    return {
      goals,
      records,
      retrospectives,
    }
  })
}

export function isGoal(timeline: types.Timeline): boolean {
  return timeline.timelineType === 'goal'
}
export function isRecord(timeline: types.Timeline): boolean {
  return timeline.timelineType === 'record'
}
export function isRetrospective(timeline: types.Timeline): boolean {
  return timeline.timelineType === 'retrospective'
}
