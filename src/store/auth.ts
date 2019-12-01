import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'
import { user as getUser } from '~/modules/firebase/firestore/users'

export interface AuthState extends types.Auth {}

export const state = () => consts.AUTH_INIT_VALUE

export const actions = {
  // prettier-ignore
  async getUser({ commit, state }: { commit: any, state: AuthState }): Promise<void> {
    const user = await getUser(state.uid)
    if (user) commit('setUser', user)
  }
}

export const mutations = {
  setAuth(state: AuthState, auth: AuthState): void {
    state.uid = auth.uid
    state.refreshToken = auth.refreshToken
    state.displayName = auth.displayName
    state.email = auth.email
    state.emailVerified = auth.emailVerified
    state.photoURL = auth.photoURL
    state.isLoggedIn = auth.isLoggedIn
  },
  clearAuth(state: AuthState): void {
    // TODO: state = AUTH_INIT_VALUE って書くと警告が出る
    state.uid = consts.AUTH_INIT_VALUE.uid
    state.refreshToken = consts.AUTH_INIT_VALUE.refreshToken
    state.displayName = consts.AUTH_INIT_VALUE.displayName
    state.email = consts.AUTH_INIT_VALUE.email
    state.emailVerified = consts.AUTH_INIT_VALUE.emailVerified
    state.photoURL = consts.AUTH_INIT_VALUE.photoURL
    state.isLoggedIn = consts.AUTH_INIT_VALUE.isLoggedIn
    state.user = undefined
  },
  setUser(state: AuthState, user: types.User): void {
    state.user = { ...user }
  },
}
