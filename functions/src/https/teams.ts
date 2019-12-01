import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import * as types from '../types'
import storeTeam from '../modules/domains/teams/storeTeam'
import updateTeam from '../modules/domains/teams/updateTeam'
import deleteTeam from '../modules/domains/teams/deleteTeam'
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

  const teamDraft: types.TeamDraft = req.body.team as types.TeamDraft
  const team = await storeTeam(teamDraft)
  console.log(team)

  res.status(200).send({ team })
}

async function put(
  req: functions.https.Request,
  res: express.Response
): Promise<any> {
  if (!validatePost(req)) {
    res.status(422).send({ error: 'validation error' })
    return Promise.reject(new Error('error'))
  }

  let team: types.Team = req.body.team as types.Team
  team = await updateTeam(team)
  console.log(team)

  res.status(200).send({ team })
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
  const teamId: string = req.query.teamId
  await deleteTeam(teamId)

  res.status(200).send({ message: 'ok' })
}
