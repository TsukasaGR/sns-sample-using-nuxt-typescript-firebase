import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import * as types from '../types'
import storeRecord from '../modules/domains/records/storeRecord'
import updateRecord from '../modules/domains/records/updateRecord'
import deleteRecord from '../modules/domains/records/deleteRecord'
import { FIREBASE_REGION } from '../env'
const cors = _cors({ origin: true })

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  memory: '1GB',
}

module.exports = functions
  .region(FIREBASE_REGION)
  .runWith(runtimeOpts)
  .https.onRequest((req: functions.https.Request, res: express.Response) => {
    return cors(req, res, async () => {
      switch (req.method) {
        case 'POST':
          await post(req, res)
          break
        case 'PUT':
          await put(req, res)
          break
        case 'DELETE':
          await deleteObject(req, res)
          break
        default:
          res.status(404).send({ error: 'Bad Request' })
          break
      }
    })
  })

function validatePost(req: functions.https.Request): boolean {
  console.log(req)
  return true
}

async function post(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  const recordDraft: types.RecordDraft = req.body.record as types.RecordDraft
  const record = await storeRecord(recordDraft)
  console.log(record)

  res.status(200).send({ record })
}

async function put(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  let record: types.Record = req.body.record as types.Record
  record = await updateRecord(record)
  console.log(record)

  res.status(200).send({ record })
}

async function deleteObject(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  // TODO: queryでなくparamsにしたい
  const recordId: string = req.query.recordId
  await deleteRecord(recordId)

  res.status(200).send({ message: 'ok' })
}
