import * as types from '../../../types'
import { deleteObject } from '../../firestore/util'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()

export default async function handle(goalId: string): Promise<void> {
  const collection = 'scheduleDates'
  const deletePromise: Promise<any>[] = []
  const scheduleTypes: types.ScheduleType[] = ['record', 'retrospective']
  for (const scheduleType of scheduleTypes) {
    await db
      .collection(`${scheduleType}s`)
      .where('goalId', '==', goalId)
      .get()
      .then(query => {
        query.forEach(doc => {
          deletePromise.push(
            deleteObject<types.ScheduleDate>(
              collection,
              doc.data() as types.ScheduleDate
            )
          )
        })
      })
  }

  await Promise.all(deletePromise)
}
