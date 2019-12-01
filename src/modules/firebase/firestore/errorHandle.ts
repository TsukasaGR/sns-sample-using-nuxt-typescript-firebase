import { DocumentSnapshot, QuerySnapshot } from '@firebase/firestore-types'

export function snapshotErrorHandle(
  func: Promise<DocumentSnapshot | QuerySnapshot>
): Promise<any> {
  return func
    .then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
}

export async function existErrorHandle(
  func: Promise<DocumentSnapshot>
): Promise<any> {
  const snapshot: DocumentSnapshot = await snapshotErrorHandle(func)
  if (!snapshot.exists) {
    throw new Error(`DocumentSnapshot ${snapshot.ref.path} is undefined`)
  }
  return snapshot
}
