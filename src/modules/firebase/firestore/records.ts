import { DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import {
  snapshotErrorHandle,
  existErrorHandle,
} from '~/modules/firebase/firestore/errorHandle'
const firestore = firebase.firestore()
const recordsCollection = firestore.collection('records')

export async function all(
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Record[]> {
  const records: types.Record[] = []
  await snapshotErrorHandle(recordsCollection.get()).then(query => {
    query.forEach(doc => {
      records.push(doc.data() as types.Record)
    })
  })

  return sortRecords(records, sortOrder)
}

export async function record(recordId: string): Promise<types.Record> {
  const recordDoc: DocumentSnapshot = await existErrorHandle(
    recordsCollection.doc(recordId).get()
  )
  return recordDoc.data() as types.Record
}

export async function recordsOfUser(
  userId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Record[]> {
  const records: types.Record[] = []
  await snapshotErrorHandle(
    recordsCollection.where('userId', '==', userId).get()
  ).then(query => {
    query.forEach(doc => {
      records.push(doc.data() as types.Record)
    })
  })

  return sortRecords(records, sortOrder)
}

export async function recordsOfGoal(
  goalId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Record[]> {
  const records: types.Record[] = []
  await snapshotErrorHandle(
    recordsCollection.where('goalId', '==', goalId).get()
  ).then(query => {
    query.forEach(doc => {
      records.push(doc.data() as types.Record)
    })
  })
  return sortRecords(records, sortOrder)
}

export async function recordOfScheduleDate(
  scheduleDateId: string
): Promise<types.Record | null> {
  let record: types.Record | null = null
  await snapshotErrorHandle(
    recordsCollection.where('scheduleDateId', '==', scheduleDateId).get()
  ).then(query => {
    query.forEach(doc => {
      record = doc.data() as types.Record
    })
  })
  return record
}

function sortRecords(
  records: types.Record[],
  sortOrder: appTypes.SortOrder = 'asc'
): types.Record[] {
  records.sort((a, b) => {
    if (sortOrder === 'desc') {
      if (a.createdAt > b.createdAt) return -1
      if (a.createdAt < b.createdAt) return 1
      return 0
    } else {
      if (a.createdAt < b.createdAt) return -1
      if (a.createdAt > b.createdAt) return 1
      return 0
    }
  })
  return records
}
