import { Dayjs } from 'dayjs'
import dayjs from '~/plugins/dayjs'
import firebase from '~/plugins/firebase'
import { SelectWeeksProperty, SELECT_WEEKS } from '~/constants/domains/schedule'
import * as types from '~/types/domainTypes'
import { sortScheduleDates } from '~/modules/domains/scheduleDate'

export function dayjsFromNow(): Dayjs {
  return dayjs()
}

export function timestampOfCurrentTime(): number {
  return dayjs().valueOf()
}

export function displayTimestamp(timestamp: number): string {
  if (timestamp === 0) return dayjs().format('MM/DD HH:mm')
  return dayjs(timestamp).format('MM/DD HH:mm')
}

export function displayDatetime(timestamp: number): string {
  if (timestamp === 0) return dayjs().format('YYYY-MM-DD HH:mm')
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

export function dayjsFromFirestoreTimestamp(
  timestamp: firebase.firestore.Timestamp
): Dayjs {
  if (!(timestamp instanceof firebase.firestore.Timestamp)) return dayjs() // ゴミデータフィルター
  return dayjs(timestamp.toDate())
}

export function displayDateFromFirestoreTimestamp(
  timestamp: firebase.firestore.Timestamp
): string {
  return formatToString(timestamp, 'YYYY/MM/DD')
}

export function displayDatetimeFromFirestoreTimestamp(
  timestamp: firebase.firestore.Timestamp
): string {
  return formatToString(timestamp, 'MM/DD HH:mm')
}

export function displayDatetimeByMMDD(
  timestamp: firebase.firestore.Timestamp
): string {
  return formatToString(timestamp, 'MM/DD')
}

export function displayDatetimeByMMDDWEEK(
  timestamp: firebase.firestore.Timestamp
): string {
  const weekProperty: SelectWeeksProperty | undefined = SELECT_WEEKS.find(
    week => week.num === dayjsFromFirestoreTimestamp(timestamp).day()
  )
  if (weekProperty === undefined) return displayDatetimeByMMDDWEEK(timestamp)
  return formatToString(timestamp, `MM/DD（${weekProperty.jaShort}）`)
}

function formatToString(
  timestamp: firebase.firestore.Timestamp,
  format: string
): string {
  return dayjsFromFirestoreTimestamp(timestamp).format(format)
}

export function fromNow(timestamp: number): string {
  return dayjs(timestamp).fromNow()
}

// 残り日数または残り時間を返す、過ぎている場合はマイナス値
export function nextSchedule(
  undoneScheduleDates: types.ScheduleDate[]
): types.DiffDate {
  const diffDate: types.DiffDate = {
    diff: 0,
    unit: '日',
  }
  // 直近次のスケジュールを先頭にするためソート
  const sortedScheduleDates = sortScheduleDates(undoneScheduleDates)
  const nextScheduleDate = dayjsFromFirestoreTimestamp(
    sortedScheduleDates[0].scheduleAt
  )
  diffDate.diff = nextScheduleDate.diff(dayjsFromNow(), 'day')
  if (diffDate.diff === 0) {
    diffDate.diff = nextScheduleDate.diff(dayjsFromNow(), 'hour')
    diffDate.unit = '時間'
  }
  return diffDate
}
