import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

// prettier-ignore
export function storeNotice(notice: types.NoticeDraft): Promise<types.Notice> {
  return axios.post<apiTypes.StoreOrUpdateNoticeSuccess>(`${apiConst.API_NOTICES_URL}`, { notice })
    .then((res: AxiosResponse) => res.data.notice)
}

// prettier-ignore
export function updateNotice(notice: types.NoticeDraft): Promise<types.Notice> {
  return axios
    .put<apiTypes.StoreOrUpdateNoticeSuccess>(`${apiConst.API_NOTICES_URL}`, {notice})
    .then((res: AxiosResponse) => res.data.notice)
}
