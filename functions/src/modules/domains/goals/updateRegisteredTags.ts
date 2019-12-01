import * as types from '../../../types'
import { update } from '../../firestore/util'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()
const usersCollection = db.collection('users')

export default async function handle(goal: types.Goal): Promise<void> {
  const userDoc = await usersCollection.doc(goal.userId).get()
  const user = userDoc.data() as types.User
  if (!user) {
    console.log('user情報なし', goal)
    return
  }
  const userTags = user.tags ? user.tags : []
  const goalTags = goal.tags ? goal.tags : []
  const mergedTags = userTags
    .concat(goalTags)
    .filter((x, i, self) => self.indexOf(x) === i)
    .sort()
  user.tags = mergedTags
  update<types.User>('users', user)
}
