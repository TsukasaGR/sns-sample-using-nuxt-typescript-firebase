import { DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import { sortScheduleDates } from '~/modules/domains/scheduleDate'
import {
  snapshotErrorHandle,
  existErrorHandle,
} from '~/modules/firebase/firestore/errorHandle'
const firestore = firebase.firestore()
const scheduleDatesCollection = firestore.collection('scheduleDates')

export async function scheduleDate(
  scheduleDateId: string
): Promise<types.ScheduleDate> {
  const scheduleDateDoc: DocumentSnapshot = await existErrorHandle(
    scheduleDatesCollection.doc(scheduleDateId).get()
  )
  return scheduleDateDoc.data() as types.ScheduleDate
}

export async function scheduleDatesOfUser(
  userId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.ScheduleDate[]> {
  const scheduleDates: types.ScheduleDate[] = []
  await snapshotErrorHandle(
    scheduleDatesCollection.where('createdUser', '==', userId).get()
  ).then(query => {
    query.forEach(doc => {
      scheduleDates.push(doc.data() as types.ScheduleDate)
    })
  })
  return sortScheduleDates(scheduleDates, sortOrder)
}

export async function scheduleDatesOfGoal(
  goalId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.ScheduleDate[]> {
  const scheduleDates: types.ScheduleDate[] = []
  await snapshotErrorHandle(
    scheduleDatesCollection.where('goalId', '==', goalId).get()
  ).then(query => {
    query.forEach(doc => {
      scheduleDates.push(doc.data() as types.ScheduleDate)
    })
  })
  return sortScheduleDates(scheduleDates, sortOrder)
}
