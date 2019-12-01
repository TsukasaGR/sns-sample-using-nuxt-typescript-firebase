import * as types from '../../../types'
import { store, deleteObject } from '../../firestore/util'
import dayjs, {
  dateOfOrdinalWeekDay,
  dayjsFromFirestoreTimestamp,
} from '../../dayjs'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()

type ProcessPromise = Promise<any> | undefined

// record, retrospectiveどちらもまとめて更新するようにする手もあるが、今後どちらかだけ更新させたくないケースがあり得るのでどちらを更新するのか明示的に引数で渡すようにしている
export default async function handle(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): Promise<void> {
  const collection = 'scheduleDates'
  const schedule =
    scheduleType === 'record'
      ? goal.scheduleOfRecord
      : goal.scheduleOfRetrospective

  // 未公開の場合は何も処理を行わない
  if (!goal.hasOwnProperty('publishedAt') || !goal.publishedAt) return

  let promiseAll: ProcessPromise[] = []

  // 既存スケジュールで未登録のものを削除する
  const deleteList: types.ScheduleDate[] = []
  const doneOfGoal: (types.Record | types.Retrospective)[] = []
  await db
    .collection(`${scheduleType}s`)
    .where('goalId', '==', goal.objectID)
    .get()
    .then(query => {
      query.forEach(doc => {
        doneOfGoal.push(doc.data() as types.Record | types.Retrospective)
      })
    })
  await db
    .collection(collection)
    .where('goalId', '==', goal.objectID)
    .where('scheduleType', '==', scheduleType)
    .get()
    .then(query => {
      query.forEach(doc => {
        const data: types.ScheduleDate = doc.data() as types.ScheduleDate
        if (
          !doneOfGoal.find(done => data.objectID === done.scheduleDateId) &&
          data.objectID // TODO: ゴミデータが入っているので暫定で入れている
        )
          deleteList.push(data)
      })
    })

  const deletePromise = []
  for (const deleteData of deleteList) {
    deletePromise.push(deleteObject<types.ScheduleDate>(collection, deleteData))
  }

  promiseAll = promiseAll.concat(deletePromise)

  // スケジュール未設定、またはアーカイブ済みの場合は登録処理をスキップ
  if (
    !schedule ||
    !schedule.periodSpan ||
    schedule.periodSpan === 0 ||
    goal.archivedAt
  ) {
    await Promise.all(promiseAll)
    return
  }

  const fixedHour = schedule.hour - 9 // UTCで計算されるため、最終的にデータを追加する際には9時間プラスする
  /*
   * 日本時間ベースで日付の計算を行うため9時間プラスする
   * - dayjs()で生成される時刻がUTCのため、hourを+9することで日本時間を得ることができる
   */
  const startAt: dayjs.Dayjs = dayjs().hour(dayjs().hour() + 9) // 日本時間ベースで日付の計算を行うため9時間プラスする
  /*
   * 日本時間ベースで日付の計算を行うため9時間プラスする
   * また対象日にち内であればギリギリの時間までスケジュール登録するため、時刻を23:59:59に設定する
   * フロントから11/23のデータを渡した際、USTに変換され11/22 15:00で受け取ってしまうことになるため、まずはadd(9, 'hour')で11/23 00:00で正しい日付に置き換えた後にhour(23)で時刻を23時に設定している
   */
  // prettier-ignore
  const endAt: dayjs.Dayjs = dayjs(goal.endAt.toDate()).add(9, 'hour').hour(23).minute(59).second(59)
  const diff: number = endAt.diff(startAt, 'day') + 1
  const monthDiff: number = endAt.date(1).diff(startAt.date(1), 'month') + 1
  const dates: string[] = []

  switch (schedule.period) {
    case 'daily':
      for (let i = 0; i <= diff; i = i + schedule.periodSpan) {
        // prettier-ignore
        const targetDate = startAt.add(i, 'day').hour(schedule.hour).set('m', 0)
        if (targetDate.diff(startAt) > 0 && endAt.diff(targetDate) > 0) {
          dates.push(targetDate.hour(fixedHour).format('YYYY-MM-DD HH:mm'))
        }
      }
      break
    case 'weekly':
      for (let i = 0; i <= diff; i++) {
        // prettier-ignore
        const targetDate = startAt.add(i, 'day').hour(schedule.hour).set('m', 0)
        if (
          schedule.option !== undefined &&
          schedule.option.hasOwnProperty('weekDays') &&
          (schedule.option as types.WeeklyOption).weekDays !== undefined &&
          (schedule.option as types.WeeklyOption).weekDays.includes(
            targetDate.weekday() as types.WeekDay
          ) &&
          (targetDate.week() - startAt.week()) % schedule.periodSpan === 0
        ) {
          if (targetDate.diff(startAt) > 0 && endAt.diff(targetDate) > 0) {
            dates.push(targetDate.hour(fixedHour).format('YYYY-MM-DD HH:mm'))
          }
        }
      }
      break
    case 'monthly':
      for (let i = 0; i <= monthDiff; i = i + schedule.periodSpan) {
        switch ((schedule.option as types.MonthlyOption).optionType) {
          case '日付指定':
            let day = startAt.add(i, 'month').date(1)
            // prettier-ignore
            const option = (schedule.option as types.MonthlyOption).option as types.MonthlyDayOption
            if (option.day <= day.endOf('month').date()) {
              day = day.date(option.day)
              const targetDate = day.hour(schedule.hour).set('m', 0)
              if (targetDate.diff(startAt) > 0 && endAt.diff(targetDate) > 0) {
                dates.push(
                  targetDate.hour(fixedHour).format('YYYY-MM-DD HH:mm')
                )
              }
            }
            break
          case '曜日指定':
            // prettier-ignore
            const day2 = startAt.add(i, 'month').date(1).format('YYYY-MM')
            // prettier-ignore
            const option2 = (schedule.option as types.MonthlyOption).option as types.MonthlyWeekOption
            const ordinalNumber = option2.ordinalNumber
            const weekDay = option2.weekDay
            // prettier-ignore
            const scheduleDate = dateOfOrdinalWeekDay(day2, ordinalNumber, weekDay)
            if (scheduleDate) {
              const targetDate = scheduleDate.hour(schedule.hour).set('m', 0)
              if (targetDate.diff(startAt) > 0 && endAt.diff(targetDate) > 0) {
                dates.push(
                  targetDate.hour(fixedHour).format('YYYY-MM-DD HH:mm')
                )
              }
            }
            break
          default:
            console.log(
              new Error(
                'modules/domains/scheduleDates/storeScheduleDates/error/1'
              )
            )
        }
      }
      break
    default:
      console.log(
        new Error('modules/domains/scheduleDates/storeScheduleDates/error/2')
      )
  }

  // スケジュール登録
  // 登録済み記録/振り返りのスケジュール日を取得
  const scheduleDateOfDone: types.ScheduleDate[] = []
  await Promise.all(
    doneOfGoal.map(done => {
      // スケジュールを指定しない記録/振り返りは対象外
      if (!done.scheduleDateId) return undefined
      return async () => {
        // prettier-ignore
        const scheduleDate = await db.collection(collection).doc(done.scheduleDateId).get()
        // prettier-ignore
        if (scheduleDate.data()) scheduleDateOfDone.push(scheduleDate.data() as types.ScheduleDate)
      }
    })
  )

  promiseAll = promiseAll.concat(
    dates.map(date => {
      // 登録しようとしたスケジュール日で、すでに他の記録/振り返りが作成されている場合は対象スケジュール日を登録しない(対象スケジュール日が削除されないため)
      if (
        scheduleDateOfDone.find(
          // prettier-ignore
          doneDate => dayjsFromFirestoreTimestamp(doneDate.scheduleAt).format('YYYYMMDD') === dayjs(date).format('YYYYMMDD')
        )
      )
        return undefined

      const scheduleDate: types.ScheduleDateDraft = {
        objectID: null,
        scheduleType,
        goalId: goal.objectID,
        createdAt: dayjs().valueOf(),
        createdUser: goal.userId,
        scheduleAt: firebase.firestore.Timestamp.fromDate(new Date(date)),
      }
      // prettier-ignore
      return store<types.ScheduleDateDraft, types.ScheduleDate>(collection, scheduleDate)
    })
  )

  await Promise.all(promiseAll)
}
