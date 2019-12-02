import firebase from '~/plugins/firebase'
import { CollectionReference } from '@firebase/firestore-types'
import { CollectionType } from '~/types/domainTypes'

export default firebase

// prettier-ignore
export function collection(collectionName: CollectionType): CollectionReference {
  const firestore = firebase.firestore()
  return firestore.collection(collectionName)
}
