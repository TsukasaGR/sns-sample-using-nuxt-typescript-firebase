import { Store } from 'vuex'
import axios from 'axios'
import * as token from '~/modules/firebase/token'
import rollbar from '~/modules/rollbar'
import * as env from '~/constants/env'

export default ({ store }: { store: Store<any> }) => {
  const baseURL: string = String(env.API_BASE_URL)
  axios.defaults.baseURL = baseURL

  axios.interceptors.request.use(async config => {
    const idToken = await token.getIdToken()
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`
    }
    store.commit('loading/updateState', true)
    return config
  })

  axios.interceptors.response.use(
    response => {
      store.commit('loading/updateState', false)
      return response
    },
    error => {
      store.commit('loading/updateState', false)
      // 認証エラーの場合はログアウト処理を行う
      if (
        error.response &&
        error.response.status &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        rollbar.error(error, `status ${error.response.status}`)
        // auth.error(error)
      } else {
        rollbar.error(error)
      }

      return Promise.reject(error)
    }
  )
}
