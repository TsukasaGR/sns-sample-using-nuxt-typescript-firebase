export interface LoadingState {
  isLoad: boolean
}

export const LOADING_STATE_INIT_VALUE: LoadingState = {
  isLoad: false,
}

export const state = () => LOADING_STATE_INIT_VALUE

export const actions = {}

export const mutations = {
  updateState(state: LoadingState, isLoad: boolean): void {
    state.isLoad = isLoad
  },
}
