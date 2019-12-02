import { check } from 'express-validator'
import initializeFirebaseAdminApp from '../modules/initializeFirebaseAdminApp'
import { Comment } from '../types'
import { comment as getComment } from '../modules/domains/comments'
initializeFirebaseAdminApp()

export function postComment(): any {
  return [
    // prettier-ignore
    check('comment').not().isEmpty().withMessage(`commentは必須です`),
    // prettier-ignore
    check('comment.createdAt')
      .not().isEmpty().withMessage(`投稿日は必須です`)
      .isNumeric().withMessage(`投稿日はタイムスタンプ形式です`),
    // prettier-ignore
    check('comment.createdUser')
      .not().isEmpty().withMessage(`投稿者は必須です`)
      .isString().withMessage(`投稿者は文字列です`),
    // prettier-ignore
    check('comment.body').not().isEmpty().withMessage(`本文は必須です`),
  ]
}

export function putComment(comment: Comment | undefined): any {
  return [
    // prettier-ignore
    check('token').custom(async value => {
      if (!comment || !comment.objectID) return false
      const commentFromDB = await getComment(comment.objectID)
      return commentFromDB && commentFromDB.createdUser === value
    }).withMessage(`投稿者のみ変更可能です`),
    // prettier-ignore
    check('comment').not().isEmpty().withMessage(`commentは必須です`),
    // prettier-ignore
    check('comment.objectID').not().isEmpty().withMessage(`objectIDは必須です`),
    // prettier-ignore
    check('comment.createdAt')
      .not().isEmpty().withMessage(`投稿日は必須です`)
      .isNumeric().withMessage(`投稿日はタイムスタンプ形式です`),
    // prettier-ignore
    check('comment.createdUser')
      .not().isEmpty().withMessage(`投稿者は必須です`)
      .isString().withMessage(`投稿者は文字列です`),
    // prettier-ignore
    check('comment.body').not().isEmpty().withMessage(`本文は必須です`),
  ]
}
