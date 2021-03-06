import { DocumentSnapshot } from '@firebase/firestore-types'
import { collection } from '~/modules/firebase'
import * as types from '~/types/domainTypes'
import { snapshotErrorHandle } from '~/modules/firebase/firestore/errorHandle'
const usersCollection = collection('users')

export async function user(objectID: string): Promise<types.User> {
  const userDoc: DocumentSnapshot = await snapshotErrorHandle(
    usersCollection.doc(objectID).get()
  )
  return userDoc.data() as types.User
}

export async function allUser(): Promise<types.User[]> {
  const users: types.User[] = []
  await snapshotErrorHandle(usersCollection.get()).then(qs => {
    qs.forEach(doc => users.push(doc.data() as types.User))
  })
  return users
}

export async function usersDesc(): Promise<types.User[]> {
  const users: types.User[] = await allUser()

  users.sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1
    if (a.createdAt < b.createdAt) return 1
    return 0
  })

  return users
}
