import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import rollbar from '~/modules/rollbar'
import { DocumentData } from '@firebase/firestore-types'
const firestore = firebase.firestore()
const goalsCollection = firestore.collection('goals')

export interface GoalsState {
  goals: types.Goal[]
}

export const GOALS_STATE_INIT_VALUE: GoalsState = {
  goals: [],
}

export const state = () => GOALS_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }, payload: any): Promise<DocumentData[]> => {
      return bindFirestoreRef(
        'goals',
        goalsCollection.where('userId', '==', payload.userId)
      ).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unBind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('goals')
  }),
}
