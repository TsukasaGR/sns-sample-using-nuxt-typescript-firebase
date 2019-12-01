import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import * as types from '../types'
import storeRetrospective from '../modules/domains/retrospectives/storeRetrospective'
import updateRetrospective from '../modules/domains/retrospectives/updateRetrospective'
import deleteRetrospective from '../modules/domains/retrospectives/deleteRetrospective'
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

  const retrospectiveDraft: types.RetrospectiveDraft = req.body
    .retrospective as types.RetrospectiveDraft
  const retrospective = await storeRetrospective(retrospectiveDraft)
  console.log(retrospective)

  res.status(200).send({ retrospective })
}

async function put(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  let retrospective: types.Retrospective = req.body
    .retrospective as types.Retrospective
  retrospective = await updateRetrospective(retrospective)
  console.log(retrospective)

  res.status(200).send({ retrospective })
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
  const retrospectiveId: string = req.query.retrospectiveId
  await deleteRetrospective(retrospectiveId)

  res.status(200).send({ message: 'ok' })
}
