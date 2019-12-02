import * as admin from 'firebase-admin'
import { FIREBASE_DATABASE_URL, FIREBASE_ADMIN_SDK_KEY } from '../env'
const serviceAccount = require(FIREBASE_ADMIN_SDK_KEY as string)

export default (): void => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: FIREBASE_DATABASE_URL,
    })
  }
}
