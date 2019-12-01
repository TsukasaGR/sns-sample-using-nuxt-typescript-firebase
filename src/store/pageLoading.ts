export interface PageLoadingState {
  isLoad: boolean
}

export const LOADING_STATE_INIT_VALUE: PageLoadingState = {
  isLoad: false,
}

export const state = () => LOADING_STATE_INIT_VALUE

export const actions = {}

export const mutations = {
  updateState(state: PageLoadingState, isLoad: boolean): void {
    state.isLoad = isLoad
  },
}
