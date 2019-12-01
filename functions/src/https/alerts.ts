import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import remind from '../modules/domains/alerts/remind'
import { FIREBASE_REGION } from '../env'
const cors = _cors({ origin: true })

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 540,
  memory: '1GB',
}

module.exports = functions
  .region(FIREBASE_REGION)
  .runWith(runtimeOpts)
  .https.onRequest((req: functions.https.Request, res: express.Response) => {
    return cors(req, res, async () => {
      switch (req.method) {
        case 'GET':
          await get(res)
          break
        default:
          res.status(404).send({ error: 'Bad Request' })
          break
      }
    })
  })

async function get(res: express.Response): Promise<any> {
  await remind()
  res.status(200).send()
}
