import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import * as types from '../types'
import storeOrUpdate from '../modules/domains/users/storeUpUpdateUser'
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
        case 'PUT':
          await put(req, res)
          break
        default:
          res.status(404).send({ error: 'Bad Request' })
          break
      }
    })
  })

function validatePost(req: functions.https.Request): boolean {
  return req.body.hasOwnProperty('user')
}

async function put(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  const user: types.User = req.body.user
  user.createdUser = user.objectID
  await storeOrUpdate(user)

  res.status(200).send({ user })
}
