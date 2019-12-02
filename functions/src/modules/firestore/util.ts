// prettier-ignore
import { CollectionReference, DocumentReference, DocumentSnapshot } from '@firebase/firestore-types'
import firebase from '../initializeFirebaseApp'
import * as util from '../firestore/util'
import { DomainTypeBase } from '../../types'
const db = firebase.firestore()

// prettier-ignore
export async function get<T extends DomainTypeBase>(collectionName: string, objectID: string): Promise<T | undefined> {
  const collection = db.collection(collectionName)
  const ref: DocumentSnapshot = await collection.doc(objectID).get()
  return ref.data() as T
}

// addしたあとに発行されたidをobjectIDとして再度セットする
// prettier-ignore
export async function add<D, T>(collection: CollectionReference, draft: D): Promise<T> {
  const ref: DocumentReference = await collection.add(draft)
  const object: T = ({ ...draft, objectID: ref.id } as unknown) as T
  await collection.doc(ref.id).set(object)
  return object
}

export function store<D, T>(collectionName: string, draft: D): Promise<T> {
  const collection = db.collection(collectionName)
  return util.add<D, T>(collection, draft)
}

// prettier-ignore
export async function update<T extends DomainTypeBase>(collectionName: string, object: T): Promise<T> {
  const collection = db.collection(collectionName)
  const ref: DocumentReference = collection.doc(object.objectID)
  await ref.set(object)
  return object
}

// prettier-ignore
export async function deleteObject<T extends DomainTypeBase>(collectionName: string, object: T): Promise<T> {
  const collection = db.collection(collectionName)
  await collection.doc(object.objectID).delete()
  return object
}

// prettier-ignore
export function deleteObjectFromObjectID(collectionName: string, objectID: string): Promise<void> {
  const collection = db.collection(collectionName)
  const object = collection.doc(objectID)
  return object.delete()
}
