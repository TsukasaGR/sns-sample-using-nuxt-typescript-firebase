import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import rollbar from '~/modules/rollbar'
import { DocumentData } from '@firebase/firestore-types'
const firestore = firebase.firestore()
const recordsCollection = firestore.collection('records')

export interface RecordsState {
  records: types.Record[]
}

export const RECORDS_STATE_INIT_VALUE: RecordsState = {
  records: [],
}

export const state = () => RECORDS_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }, payload: any): Promise<DocumentData[]> => {
      return bindFirestoreRef(
        'records',
        recordsCollection.where('userId', '==', payload.userId)
      ).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unBind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('records')
  }),
}
