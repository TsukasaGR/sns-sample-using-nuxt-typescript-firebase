import * as consts from '~/constants/domainInits'

export interface InitializeState {
  done: boolean
}

export const state = () => consts.INITIALIZE_INIT_VALUE

export const mutations = {
  done(state: InitializeState): void {
    state.done = true
  },
}
