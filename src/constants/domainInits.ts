import * as types from '~/types/domainTypes'

export const AUTH_INIT_VALUE: types.Auth = {
  uid: '',
  refreshToken: '',
  displayName: '',
  email: '',
  emailVerified: '',
  photoURL: '',
  isLoggedIn: false,
}

export const COMMENT_INIT_VALUE: types.CommentDraft = {
  objectID: null,
  createdAt: 0,
  createdUser: '',
  body: '',
}

export const REPLY_INIT_VALUE: types.ReplyDraft = {
  objectID: null,
  createdAt: 0,
  createdUser: '',
  body: '',
  commentId: '',
}

export const NOTICE_INIT_VALUE: types.NoticeDraft = {
  objectID: null,
  createdAt: 0,
  createdUser: '',
  type: 'comment',
  typeId: '',
}

export const USER_INIT_VALUE: types.UserDraft = {
  objectID: null,
  createdAt: 0,
  createdUser: '',
  accountName: '',
  displayName: '',
  icon: '',
  description: '',
}
