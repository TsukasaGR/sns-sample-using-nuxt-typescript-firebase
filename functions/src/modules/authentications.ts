import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import initializeFirebaseAdminApp from './initializeFirebaseAdminApp'
initializeFirebaseAdminApp()

// prettier-ignore
export async function verifyIdToken(request: functions.https.Request): Promise<admin.auth.DecodedIdToken> {
  const bearer = (request.headers.authorization as string) || ''
  const token = bearer.substr(7)
  return await admin.auth().verifyIdToken(token)
}
