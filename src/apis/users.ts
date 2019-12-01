import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

export function storeOrUpdateUser(user: types.User): Promise<types.User | any> {
  return axios
    .put<apiTypes.StoreOrUpdateUserSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_USER}`,
      { user }
    )
    .then((res: AxiosResponse) => {
      console.log('登録 or 更新完了', res)
      return res.data.user
    })
}
