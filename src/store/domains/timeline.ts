import { firestoreAction } from 'vuexfire'
import { DocumentData } from '@firebase/firestore-types'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import rollbar from '~/modules/rollbar'
const firestore = firebase.firestore()
const commentsCollection = firestore.collection('comments')

export interface TimelineState {
  comments: types.Comment[]
}

export const TIMELINE_STATE_INIT_VALUE: TimelineState = {
  comments: [],
}

export const state = () => TIMELINE_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }): Promise<DocumentData[]> => {
      return bindFirestoreRef('comments', commentsCollection).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unbind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('comments')
  }),
}
