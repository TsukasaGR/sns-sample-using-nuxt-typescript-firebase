import * as types from '../../../types'
import { timestampOfCurrentTime } from '../../dayjs'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()
const scheduleDatesCollection = db.collection('scheduleDates')

export async function updateAlertedAt(
  scheduleDate: types.ScheduleDate
): Promise<void> {
  scheduleDate.alertedAt = firebase.firestore.Timestamp.fromMillis(
    timestampOfCurrentTime()
  )
  await scheduleDatesCollection.doc(scheduleDate.objectID).update(scheduleDate)
}
