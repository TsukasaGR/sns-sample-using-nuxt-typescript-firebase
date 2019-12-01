import {
  CollectionReference,
  DocumentReference,
} from '@firebase/firestore-types'
import firebase from '../initializeFirebaseApp'
import * as util from '../firestore/util'
const db = firebase.firestore()

// addしたあとに発行されたidをobjectIDとして再度セットする
export async function add<D, T>(
  collection: CollectionReference,
  draft: D
): Promise<T> {
  const ref: DocumentReference = await collection.add(draft)
  const object: T = ({ ...draft, objectID: ref.id } as unknown) as T
  await collection.doc(ref.id).set(object)
  return object
}

export function store<D, T>(collectionName: string, draft: D): Promise<T> {
  const collection = db.collection(collectionName)
  return util.add<D, T>(collection, draft)
}

export async function update<T>(collectionName: string, object: T): Promise<T> {
  const collection = db.collection(collectionName)
  // @ts-ignore // TODO: なんとかこのts-ignoreを外したい
  const ref: DocumentReference = collection.doc(object.objectID)
  await ref.set(object)
  return object
}

export async function deleteObject<T>(
  collectionName: string,
  object: T
): Promise<T> {
  const collection = db.collection(collectionName)
  // @ts-ignore // TODO: なんとかこのts-ignoreを外したい
  await collection.doc(object.objectID).delete()
  return object
}

export function deleteObjectFromObjectID(
  collectionName: string,
  objectID: string
): Promise<void> {
  const collection = db.collection(collectionName)
  const object = collection.doc(objectID)
  return object.delete()
}
