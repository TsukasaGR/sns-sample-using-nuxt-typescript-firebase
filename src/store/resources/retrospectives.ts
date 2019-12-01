import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import rollbar from '~/modules/rollbar'
import { DocumentData } from '@firebase/firestore-types'
const firestore = firebase.firestore()
const retrospectivesCollection = firestore.collection('retrospectives')

export interface RetrospectivesState {
  retrospectives: types.Retrospective[]
}

export const RETROSPECTIVES_STATE_INIT_VALUE: RetrospectivesState = {
  retrospectives: [],
}

export const state = () => RETROSPECTIVES_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }, payload: any): Promise<DocumentData[]> => {
      return bindFirestoreRef(
        'retrospectives',
        retrospectivesCollection.where('userId', '==', payload.userId)
      ).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unBind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('retrospectives')
  }),
}
