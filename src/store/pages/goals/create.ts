import cloneDeep from 'lodash/cloneDeep'
import * as types from '~/types/domainTypes'
import * as consts from '~/constants/domainInits'

export interface GoalsCreateState {
  goal: types.GoalDraft
  uploadFiles: File[]
  unsetScheduleOfRecord: boolean
}

export const state = () => ({
  goal: { ...consts.GOAL_INIT_VALUE },
  uploadFiles: [],
  unsetScheduleOfRecord: false,
})

export const actions = {
  initialize({ commit }): void {
    commit('setGoal', consts.GOAL_INIT_VALUE)
    commit('setUploadFiles', [])
  },
}

export const mutations = {
  setGoal(state: GoalsCreateState, goal: types.GoalDraft): void {
    state.goal = cloneDeep(goal)
  },
  setUploadFiles(state: GoalsCreateState, uploadFiles: File[]): void {
    state.uploadFiles = [...uploadFiles]
  },
  setUnsetScheduleOfRecord(
    state: GoalsCreateState,
    unsetScheduleOfRecord: boolean
  ): void {
    state.unsetScheduleOfRecord = unsetScheduleOfRecord
  },
}
