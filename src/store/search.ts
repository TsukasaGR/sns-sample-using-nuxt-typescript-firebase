export interface SearchState {
  lastSearchTimesmap: number
}

export const SEARCH_STATE_INIT_VALUE: SearchState = {
  lastSearchTimesmap: 0,
}

export const state = () => SEARCH_STATE_INIT_VALUE

export const actions = {}

export const mutations = {
  updateState(state: SearchState, timestamp: number): void {
    state.lastSearchTimesmap = timestamp
  },
}
