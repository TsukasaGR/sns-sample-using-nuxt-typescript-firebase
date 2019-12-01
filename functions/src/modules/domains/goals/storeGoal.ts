import * as types from '../../../types'
import { store } from '../../firestore/util'
import dayjs from '../../dayjs'
import firebase from '../../initializeFirebaseApp'

export default function handle(
  goalDraft: types.GoalDraft
): Promise<types.Goal> {
  if (goalDraft.hasOwnProperty('publishedAt') && goalDraft.publishedAt) {
    goalDraft.publishedAt = firebase.firestore.Timestamp.fromDate(
      dayjs(goalDraft.publishedAt.seconds * 1000).toDate()
    )
  }
  goalDraft.endAt = firebase.firestore.Timestamp.fromDate(
    dayjs(goalDraft.endAt.seconds * 1000).toDate()
  )
  return store<types.GoalDraft, types.Goal>('goals', goalDraft)
}
