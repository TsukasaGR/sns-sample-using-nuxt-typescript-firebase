import { DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import { sortGoals, isPublished } from '~/modules/domains/goal'
import {
  snapshotErrorHandle,
  existErrorHandle,
} from '~/modules/firebase/firestore/errorHandle'
const firestore = firebase.firestore()
const goalsCollection = firestore.collection('goals')

export async function all(
  sortOrder: appTypes.SortOrder = 'asc'
): Promise<types.Goal[]> {
  const goals: types.Goal[] = []
  await snapshotErrorHandle(goalsCollection.get()).then(query => {
    query.forEach(doc => {
      goals.push(doc.data() as types.Goal)
    })
  })

  return sortGoals(goals, sortOrder)
}

export async function goal(goalId: string): Promise<types.Goal> {
  const goalDoc: DocumentSnapshot = await existErrorHandle(
    goalsCollection.doc(goalId).get()
  )
  return goalDoc.data() as types.Goal
}

export async function goalOrNull(goalId: string): Promise<types.Goal | null> {
  const goalDoc: DocumentSnapshot = await snapshotErrorHandle(
    goalsCollection.doc(goalId).get()
  )
  return (goalDoc.data() as types.Goal) || null
}

export async function goalsOfUser(userId: string): Promise<types.Goal[]> {
  const goals: types.Goal[] = []
  await snapshotErrorHandle(
    goalsCollection.where('userId', '==', userId).get()
  ).then(query => {
    query.forEach(doc => {
      goals.push(doc.data() as types.Goal)
    })
  })

  return sortGoals(goals)
}

export async function publishedGoalsOfUser(
  userId: string
): Promise<types.Goal[]> {
  const goals = await goalsOfUser(userId)
  return goals.filter(goal => isPublished(goal))
}
