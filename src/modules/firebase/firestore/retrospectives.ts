import { DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import {
  snapshotErrorHandle,
  existErrorHandle,
} from '~/modules/firebase/firestore/errorHandle'
const firestore = firebase.firestore()
const retrospectivesCollection = firestore.collection('retrospectives')

export async function all(
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Retrospective[]> {
  const retrospectives: types.Retrospective[] = []
  await snapshotErrorHandle(retrospectivesCollection.get()).then(query => {
    query.forEach(doc => {
      retrospectives.push(doc.data() as types.Retrospective)
    })
  })

  return sortRetrospectives(retrospectives, sortOrder)
}

export async function retrospective(
  retrospectiveId: string
): Promise<types.Retrospective> {
  const retrospectiveDoc: DocumentSnapshot = await existErrorHandle(
    retrospectivesCollection.doc(retrospectiveId).get()
  )
  return retrospectiveDoc.data() as types.Retrospective
}

export async function retrospectivesOfUser(
  userId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Retrospective[]> {
  const retrospectives: types.Retrospective[] = []
  await snapshotErrorHandle(
    retrospectivesCollection.where('userId', '==', userId).get()
  ).then(query => {
    query.forEach(doc => {
      retrospectives.push(doc.data() as types.Retrospective)
    })
  })
  return sortRetrospectives(retrospectives, sortOrder)
}

export async function retrospectivesOfGoal(
  goalId: string,
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Retrospective[]> {
  const retrospectives: types.Retrospective[] = []
  await snapshotErrorHandle(
    retrospectivesCollection.where('goalId', '==', goalId).get()
  ).then(query => {
    query.forEach(doc => {
      retrospectives.push(doc.data() as types.Retrospective)
    })
  })
  return sortRetrospectives(retrospectives, sortOrder)
}

export async function retrospectiveOfScheduleDate(
  scheduleDateId: string
): Promise<types.Retrospective | null> {
  let retrospective: types.Retrospective | null = null
  await snapshotErrorHandle(
    retrospectivesCollection.where('scheduleDateId', '==', scheduleDateId).get()
  ).then(query => {
    query.forEach(doc => {
      retrospective = doc.data() as types.Retrospective
    })
  })
  return retrospective
}

function sortRetrospectives(
  retrospectives: types.Retrospective[],
  sortOrder: appTypes.SortOrder = 'asc'
): types.Retrospective[] {
  retrospectives.sort((a, b) => {
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
  return retrospectives
}
