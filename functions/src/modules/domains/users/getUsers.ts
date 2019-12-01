import * as types from '../../../types'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()
const goalsCollection = db.collection('users')

export default async function handle(): Promise<types.User[]> {
  const users: types.User[] = []
  await goalsCollection.get().then(qs => {
    qs.forEach(doc => {
      users.push(doc.data() as types.User)
    })
  })
  return users
}
