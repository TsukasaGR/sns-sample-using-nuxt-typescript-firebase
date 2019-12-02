import { Comment, CommentDraft } from '../../types'
import { get, store, update } from '../firestore/util'

export function comment(objectID: string): Promise<Comment | undefined> {
  return get<Comment>('comments', objectID)
}

export function storeComment(commentDraft: CommentDraft): Promise<Comment> {
  return store<CommentDraft, Comment>('comments', commentDraft)
}

export function updateComment(comment: Comment): Promise<Comment> {
  return update<Comment>('comments', comment)
}
