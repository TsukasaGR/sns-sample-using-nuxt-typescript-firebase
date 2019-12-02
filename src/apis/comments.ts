import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

// prettier-ignore
export function storeComment(comment: types.CommentDraft): Promise<types.Comment> {
  return axios.post<apiTypes.StoreOrUpdateCommentSuccess>(`${apiConst.API_COMMENTS_URL}`, { comment })
    .then((res: AxiosResponse) => res.data.comment)
}

// prettier-ignore
export function updateComment(comment: types.CommentDraft): Promise<types.Comment> {
  return axios
    .put<apiTypes.StoreOrUpdateCommentSuccess>(`${apiConst.API_COMMENTS_URL}`, {comment})
    .then((res: AxiosResponse) => res.data.comment)
}
