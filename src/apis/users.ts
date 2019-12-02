import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

// prettier-ignore
export function updateUser(user: types.UserDraft): Promise<types.User> {
  return axios
    .put<apiTypes.StoreOrUpdateUserSuccess>(`${apiConst.API_USERS_URL}`, {user})
    .then((res: AxiosResponse) => res.data.user)
}
