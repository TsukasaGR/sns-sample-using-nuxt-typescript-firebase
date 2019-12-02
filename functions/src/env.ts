require('dotenv').config()

// process.envに入れて直接呼び出すとtypoがこわいので明示的に入れ直している
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN
export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET
// prettier-ignore
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID
export const FIREBASE_ADMIN_SDK_KEY = process.env.FIREBASE_ADMIN_SDK_KEY
export const FIREBASE_REGION = 'asia-northeast1'
