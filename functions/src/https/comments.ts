import * as functions from 'firebase-functions'
import * as express from 'express'
import * as _cors from 'cors'
import { validationResult } from 'express-validator'
import { Comment, CommentDraft } from '../types'
import { postComment, putComment } from '../validations/comments'
import { storeComment, updateComment } from '../modules/domains/comments'
import { verifyIdToken } from '../modules/authentications'
import { FIREBASE_REGION } from '../env'
const cors = _cors({ origin: true })

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 300,
  // memory: '1GB',
}

module.exports = functions
  .region(FIREBASE_REGION)
  .runWith(runtimeOpts)
  .https.onRequest((req: functions.https.Request, res: express.Response) => {
    return cors(req, res, async () => {
      try {
        // prettier-ignore
        req.body.token = await verifyIdToken(req)
      } catch (err) {
        res.status(400).send({ errors: 'token failed' })
        return
      }

      switch (req.method) {
        case 'POST':
          await post(req, res)
          break
        case 'PUT':
          await put(req, res)
          break
        default:
          res.status(404).send({ errors: 'Bad Request' })
          break
      }
    })
  })

// prettier-ignore
async function post(req: functions.https.Request, res: express.Response): Promise<any> {
  await Promise.all(postComment().map((validation: any) => validation.run(req)))
  const result = validationResult(req)
  if (!result.isEmpty()) return res.status(422).json({ errors: result.array() })

  const commentDraft: CommentDraft = req.body.comment as CommentDraft
  const comment = await storeComment(commentDraft)

  res.status(200).send({ comment })
}

// prettier-ignore
async function put(req: functions.https.Request, res: express.Response): Promise<any> {
  let comment: Comment | undefined = req.body.comment || undefined
  await Promise.all(putComment(comment).map((validation: any) => validation.run(req)))
  const result = validationResult(req)
  if (!result.isEmpty()) return res.status(422).json({ errors: result.array() })

  comment = await updateComment(comment as Comment)
  console.log(comment)

  res.status(200).send({ comment })
}
