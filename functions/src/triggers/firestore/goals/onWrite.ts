import * as functions from 'firebase-functions'
import { DocumentSnapshot } from '@google-cloud/firestore'
import * as types from '../../../types'
import storeSchedules from '../../../modules/domains/scheduleDates/storeScheduleDates'
import deleteSchedules from '../../../modules/domains/scheduleDates/deleteScheduleDates'
import updateRegisteredTags from '../../../modules/domains/goals//updateRegisteredTags'
import { FIREBASE_REGION } from '../../../env'

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '1GB',
}

type ScheduleParamDetail = {
  type: types.ScheduleType
  beforeSchedule?: types.Schedule
  afterSchedule?: types.Schedule
}

type ScheduleParam = {
  before?: types.Goal
  after?: types.Goal
  details: ScheduleParamDetail[]
}

module.exports = functions
  .region(FIREBASE_REGION)
  .runWith(runtimeOpts)
  .firestore.document('goals/{goalId}')
  // @ts-ignore // TODO: あとでなんとかする
  .onWrite((change: functions.Change<DocumentSnapshot>) => {
    // 登録、更新
    if ((change.after as DocumentSnapshot).exists) {
      const before: types.Goal | undefined = change.before
        ? ((change.before as DocumentSnapshot).data() as types.Goal)
        : undefined
      const after: types.Goal | undefined = change.before
        ? ((change.after as DocumentSnapshot).data() as types.Goal)
        : undefined

      // 新規登録の場合はobjectIDをセット前にTriggerが動くため、手動でobjectIDをセットしておく
      if (before && !before.objectID)
        before.objectID = (change.before as DocumentSnapshot).id
      if (after && !after.objectID)
        after.objectID = (change.after as DocumentSnapshot).id

      let promiseAll: Promise<any>[] = []

      // ScheduleDatesの更新
      const scheduleParams: ScheduleParam = {
        before,
        after,
        details: [
          {
            type: 'record',
            beforeSchedule: before ? before.scheduleOfRecord : undefined,
            afterSchedule: after ? after.scheduleOfRecord : undefined,
          },
          {
            type: 'retrospective',
            beforeSchedule: before ? before.scheduleOfRetrospective : undefined,
            afterSchedule: after ? after.scheduleOfRetrospective : undefined,
          },
        ],
      }
      promiseAll = promiseAll.concat(updateScheduleDates(scheduleParams))

      // User.tagsの更新
      if (after) promiseAll.push(updateRegisteredTags(after))

      return Promise.all(promiseAll)
    }
    // 削除
    else {
      const before: types.Goal = (change.before as DocumentSnapshot).data() as types.Goal
      return deleteSchedules(before.objectID)
    }
  })

function updateScheduleDates(scheduleParam: ScheduleParam): Promise<any>[] {
  const promiseAll = []

  for (const detail of scheduleParam.details) {
    // 新規登録時、または更新でかつスケジュール変更を伴う場合(※)のみスケジュールを更新
    // ※達成日、記録スケジュール、振り返りスケジュールのいずれかが更新された場合
    const isNew = !scheduleParam.before
    const isDelete = !scheduleParam.after
    // prettier-ignore
    const beforeEndAt = scheduleParam.before && scheduleParam.before.endAt ? scheduleParam.before.endAt : {}
    // prettier-ignore
    const afterEndAt = scheduleParam.after && scheduleParam.after.endAt ? scheduleParam.after.endAt : {}
    // prettier-ignore
    const isDiffEndAt = JSON.stringify(beforeEndAt) !== JSON.stringify(afterEndAt)
    // prettier-ignore
    const beforeSchedule = detail.beforeSchedule || {}
    // prettier-ignore
    const afterSchedule = detail.afterSchedule || {}
    // prettier-ignore
    const isDiffSchedule = JSON.stringify(beforeSchedule) !== JSON.stringify(afterSchedule)

    if (isNew || (!isDelete && (isDiffEndAt || isDiffSchedule))) {
      promiseAll.push(
        storeSchedules(scheduleParam.after as types.Goal, detail.type)
      )
    }
  }

  return promiseAll
}
