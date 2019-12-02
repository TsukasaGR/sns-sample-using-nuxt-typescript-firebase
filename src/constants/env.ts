// process.envに入れて直接呼び出すとtypoがこわいので明示的に入れ直している
export const NODE_ENV = process.env.NODE_ENV
export const API_BASE_URL = process.env.API_BASE_URL
export const API_KEY = process.env.API_KEY
export const AUTH_DOMAIN = process.env.AUTH_DOMAIN
export const DATABASE_URL = process.env.DATABASE_URL
export const PROJECT_ID = process.env.PROJECT_ID
export const STORAGE_BUCKET = process.env.STORAGE_BUCKET
export const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID
export const ROLLBAR_ACCESS_TOKEN = process.env.ROLLBAR_ACCESS_TOKEN
