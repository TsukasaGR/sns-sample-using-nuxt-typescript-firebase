import { Comment } from '~/types/domainTypes'
import { SortOrder } from '~/types/applicationTypes'
import { user } from '~/modules/firebase/firestore/users'

// prettier-ignore
export function sortComments(comments: Comment[], sortOrder: SortOrder = 'asc'): Comment[] {
  comments.sort((a, b) => {
    if (sortOrder === 'desc') {
      if (a.createdAt > b.createdAt) return -1
      if (a.createdAt < b.createdAt) return 1
      return 0
    } else {
      if (a.createdAt < b.createdAt) return -1
      if (a.createdAt > b.createdAt) return 1
      return 0
    }
  })
  return comments
}

export async function setUser(comment: Comment): Promise<Comment> {
  comment.user = await user(comment.createdUser)
  return comment
}

// prettier-ignore
export async function setUserOfComments(comments: Comment[]): Promise<Comment[]> {
  const promise: Promise<any>[] = comments.map(
    async comment => (comment.user = await user(comment.createdUser))
  )
  await Promise.all(promise)

  return comments
}
