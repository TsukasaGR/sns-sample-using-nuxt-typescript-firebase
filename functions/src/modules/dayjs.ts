import * as dayjs from 'dayjs'
import * as weekday from 'dayjs/plugin/weekday'
import * as weekOfYear from 'dayjs/plugin/weekOfYear'

dayjs.extend(weekday)
dayjs.extend(weekOfYear)

export default dayjs

export function dayjsFromNow(): dayjs.Dayjs {
  return dayjs()
}

export function timestampOfCurrentTime(): number {
  return dayjs().valueOf()
}

export function displayTimestamp(timestamp: number): string {
  if (timestamp === 0) return dayjs().format('YYYY-MM-DD HH:mm:ss')
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

export function dayjsFromFirestoreTimestamp(
  timestamp: firebase.firestore.Timestamp
): dayjs.Dayjs {
  return dayjs(timestamp.toDate())
}

export function displayDatetimeFromFirestoreTimestamp(
  timestamp: firebase.firestore.Timestamp
): string {
  return dayjsFromFirestoreTimestamp(timestamp).format('YYYY-MM-DD HH:mm')
}

export function displayDatetimeByMMDD(
  timestamp: firebase.firestore.Timestamp
): string {
  return dayjsFromFirestoreTimestamp(timestamp).format('MM/DD')
}

export function dateOfOrdinalWeekDay(
  yearMonth: string,
  ordinalNumber: number,
  weekDay: number
): dayjs.Dayjs | null {
  const firstOfMonth = dayjs(yearMonth).date(1)
  const firstWeekOfMonth = firstOfMonth.day()
  const targetDate =
    7 * (ordinalNumber - 1) +
    1 +
    (weekDay - firstWeekOfMonth) +
    -(Math.sign(Math.sign(weekDay - firstWeekOfMonth) + 1) - 1) * 7

  console.log(
    'targetDate: ',
    targetDate,
    'endOf: ',
    firstOfMonth.endOf('month').date()
  )
  if (targetDate > firstOfMonth.endOf('month').date()) {
    return null
  }

  return firstOfMonth.date(targetDate)
}
