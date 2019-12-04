import { DocumentSnapshot } from '@firebase/firestore-types'
import { collection } from '~/modules/firebase'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import { sortComments } from '~/modules/domains/comments'
import { setUserOfComments } from '~/modules/domains/comments'
// prettier-ignore
import { snapshotErrorHandle, existErrorHandle } from '~/modules/firebase/firestore/errorHandle'
const commentsCollection = collection('comments')

// prettier-ignore
export async function all(sortOrder: appTypes.SortOrder = 'asc'): Promise<types.Comment[]> {
  const comments: types.Comment[] = []
  await snapshotErrorHandle(commentsCollection.get()).then(query => {
    query.forEach(doc => comments.push(doc.data() as types.Comment))
  })

  return sortComments(await setUserOfComments(comments), sortOrder)
}

export async function comment(commentId: string): Promise<types.Comment> {
  const commentDoc: DocumentSnapshot = await existErrorHandle(
    commentsCollection.doc(commentId).get()
  )
  return commentDoc.data() as types.Comment
}

export async function commentsOfUser(userId: string): Promise<types.Comment[]> {
  const comments: types.Comment[] = []
  await snapshotErrorHandle(
    commentsCollection.where('userId', '==', userId).get()
  ).then(query => {
    query.forEach(doc => {
      comments.push(doc.data() as types.Comment)
    })
  })

  return sortComments(comments)
}
