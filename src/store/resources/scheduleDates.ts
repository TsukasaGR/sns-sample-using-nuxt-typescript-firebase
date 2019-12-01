import { firestoreAction } from 'vuexfire'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import rollbar from '~/modules/rollbar'
import { DocumentData } from '@firebase/firestore-types'
const firestore = firebase.firestore()
const scheduleDatesCollection = firestore.collection('scheduleDates')

export interface SchedulesState {
  scheduleDates: types.ScheduleDate[]
}

export const SCHEDULE_DATES_STATE_INIT_VALUE: SchedulesState = {
  scheduleDates: [],
}

export const state = () => SCHEDULE_DATES_STATE_INIT_VALUE

export const actions = {
  bind: firestoreAction(
    ({ bindFirestoreRef }, payload: any): Promise<DocumentData[]> => {
      return bindFirestoreRef(
        'scheduleDates',
        scheduleDatesCollection.where('createdUser', '==', payload.userId)
      ).catch(error => {
        rollbar.error('Vuexfire Error', error)
        return Promise.reject(error)
      })
    }
  ),
  unBind: firestoreAction(({ unbindFirestoreRef }): void => {
    unbindFirestoreRef('scheduleDates')
  }),
}
