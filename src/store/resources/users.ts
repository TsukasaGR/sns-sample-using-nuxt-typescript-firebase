import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'
import rollbar from '~/modules/rollbar'
import { DocumentData } from '@firebase/firestore-types'
const firestore = firebase.firestore()
const usersCollection = firestore.collection('users')

export interface UsersState {
  users: types.User[]
  user: any
}

export const USERS_STATE_INIT_VALUE: UsersState = {
  users: [],
  user: consts.USER_INIT_VALUE,
}

export const state = () => USERS_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }): Promise<DocumentData[]> => {
      return bindFirestoreRef('users', usersCollection).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unBind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('users')
  }),
  bindUser: firestoreAction(
    ({ bindFirestoreRef }, payload: any): Promise<DocumentData> => {
      // TODO: 他の用途と箱が被っているので別にしたほうが良いかも
      return bindFirestoreRef('user', usersCollection.doc(payload.id)).catch(
        error => {
          rollbar.error('Vuexfire Error', error)
          return Promise.reject(error)
        }
      )
    }
  ),
  unBindUser: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('user')
  }),
}

export const mutations = {
  setUser(state: UsersState, user: types.User): void {
    state.user.objectID = user.objectID
    state.user.accountName = user.accountName
    state.user.displayName = user.displayName
    state.user.email = user.email
    state.user.icon = user.icon
    state.user.description = user.description
  },
}
