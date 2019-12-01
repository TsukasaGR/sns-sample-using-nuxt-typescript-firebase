require('dotenv').config()

// process.envに入れて直接呼び出すとtypoがこわいので明示的に入れ直している
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN
export const FIERBASE_DATABASE_URL = process.env.FIERBASE_DATABASE_URL
export const FIERBASE_PROJECT_ID = process.env.FIERBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET
export const FIREBASE_MESSAGING_SENDER_ID =
  process.env.FIREBASE_MESSAGING_SENDER_ID
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
export const BASE_URL = process.env.BASE_URL
export const WEBHOOK_URL_DEPLOY = process.env.WEBHOOK_URL_DEPLOY
export const DEPLOY_ID_TO_NUXT = process.env.DEPLOY_ID_TO_NUXT
export const DEPLOY_ID_TO_FUNCTIONS = process.env.DEPLOY_ID_TO_FUNCTIONS
export const FIREBASE_REGION = 'asia-northeast1'
