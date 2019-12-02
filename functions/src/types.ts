export type Fixme = any

export type Draft<T, D extends keyof T> = {
  [K in keyof T]: K extends D ? T[K] | null : T[K]
}

export type CollectionType = 'comments' | 'replies' | 'notices' | 'users'

export type DomainTypeBase = {
  objectID: string
  createdAt: number
  createdUser: string
  updatedAt?: number
  updatedUser?: string
}

type CommentTypeBase = {
  commentId: string
  comment?: Comment
}

export type Auth = {
  uid: string
  refreshToken: string
  displayName: string
  email: string
  emailVerified: string
  photoURL: string
  isLoggedIn: boolean
  user?: User
}

export type User = DomainTypeBase & {
  accountName?: string
  displayName?: string
  icon?: string
  description: string
}

export type UserDraft = Draft<User, 'objectID'>

export type Comment = DomainTypeBase & {
  body: string
}

export type CommentDraft = Draft<Comment, 'objectID'>

// prettier-ignore
export type Reply = DomainTypeBase & CommentTypeBase & {
    body: string
  }

export type ReplyDraft = Draft<Reply, 'objectID'>

export type NoticeType = 'comment' | 'reply'

export type Notice = DomainTypeBase & {
  type: NoticeType
  typeId: string
}

export type NoticeDraft = Draft<Notice, 'objectID'>
