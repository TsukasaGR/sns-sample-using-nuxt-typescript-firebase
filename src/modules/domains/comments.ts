import { Comment } from '~/types/domainTypes'
import { SortOrder } from '~/types/applicationTypes'

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
