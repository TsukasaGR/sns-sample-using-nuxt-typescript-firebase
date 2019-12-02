import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

// prettier-ignore
export function storeReply(reply: types.ReplyDraft): Promise<types.Reply> {
  return axios.post<apiTypes.StoreOrUpdateReplySuccess>(`${apiConst.API_REPLIES_URL}`, { reply })
    .then((res: AxiosResponse) => res.data.reply)
}

// prettier-ignore
export function updateReply(reply: types.ReplyDraft): Promise<types.Reply> {
  return axios
    .put<apiTypes.StoreOrUpdateReplySuccess>(`${apiConst.API_REPLIES_URL}`, {reply})
    .then((res: AxiosResponse) => res.data.reply)
}
