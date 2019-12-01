import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import * as types from '../types'
import storeGoal from '../modules/domains/goals/storeGoal'
import updateGoal from '../modules/domains/goals/updateGoal'
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

  const goalDraft: types.GoalDraft = req.body.goal as types.GoalDraft
  const goal = await storeGoal(goalDraft)
  console.log(goal)

  res.status(200).send({ goal })
}

async function put(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  let goal: types.Goal = req.body.goal as types.Goal
  goal = await updateGoal(goal)
  console.log(goal)

  res.status(200).send({ goal })
}
