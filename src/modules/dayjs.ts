import { Dayjs } from 'dayjs'
import dayjs from '~/plugins/dayjs'

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
