import * as types from '../../../types'
import { update } from '../../firestore/util'
import dayjs from '../../dayjs'
import firebase from '../../initializeFirebaseApp'

export default function handle(goal: types.Goal): Promise<types.Goal> {
  if (goal.hasOwnProperty('publishedAt') && goal.publishedAt) {
    goal.publishedAt = firebase.firestore.Timestamp.fromDate(
      dayjs(goal.publishedAt.seconds * 1000).toDate()
    )
  }
  goal.endAt = firebase.firestore.Timestamp.fromDate(
    dayjs(goal.endAt.seconds * 1000).toDate()
  )
  return update<types.Goal>('goals', goal)
}
