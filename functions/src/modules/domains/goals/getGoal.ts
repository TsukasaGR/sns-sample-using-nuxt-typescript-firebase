import * as types from '../../../types'
import firebase from '../../initializeFirebaseApp'
const db = firebase.firestore()
const goalsCollection = db.collection('goals')

export default async function handle(): Promise<types.Goal[]> {
  const goals: types.Goal[] = []
  await goalsCollection.get().then(qs => {
    qs.forEach(doc => {
      goals.push(doc.data() as types.Goal)
    })
  })
  return goals
}
