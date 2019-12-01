import cloneDeep from 'lodash/cloneDeep'
import * as types from '~/types/domainTypes'

export interface GoalsEditState {
  goal: types.Goal | null
  uploadFiles: File[]
  unsetScheduleOfRecord: boolean
}

export const state = () => ({
  goal: null,
  uploadFiles: [],
  unsetScheduleOfRecord: false,
})

export const actions = {
  initialize({ commit }): void {
    commit('setGoal', null)
    commit('setUploadFiles', [])
  },
}

export const mutations = {
  setGoal(state: GoalsEditState, goal: types.Goal): void {
    state.goal = cloneDeep(goal)
  },
  setUploadFiles(state: GoalsEditState, uploadFiles: File[]): void {
    state.uploadFiles = [...uploadFiles]
  },
  setUnsetScheduleOfRecord(
    state: GoalsEditState,
    unsetScheduleOfRecord: boolean
  ): void {
    state.unsetScheduleOfRecord = unsetScheduleOfRecord
  },
}
