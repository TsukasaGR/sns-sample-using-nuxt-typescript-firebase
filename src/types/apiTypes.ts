import * as types from '~/types/domainTypes'

export type StoreOrUpdateCommentSuccess = {
  comment: types.Comment
}
export type StoreOrUpdateReplySuccess = {
  reply: types.Reply
}
export type StoreOrUpdateNoticeSuccess = {
  notice: types.Notice
}
export type StoreOrUpdateUserSuccess = {
  user: types.User
}
export type DeleteSuccess = {
  message: string
}
