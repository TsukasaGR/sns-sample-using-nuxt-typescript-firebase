import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

export function storeGoal(goal: types.GoalDraft): Promise<types.Goal | any> {
  return axios
    .post<apiTypes.StoreOrUpdateGoalSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_GOAL}`,
      { goal }
    )
    .then((res: AxiosResponse) => {
      return res.data.goal
    })
}

export function updateGoal(goal: types.Goal): Promise<types.Goal | any> {
  return axios
    .put<apiTypes.StoreOrUpdateGoalSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_GOAL}`,
      { goal }
    )
    .then((res: AxiosResponse) => {
      return res.data.goal
    })
}
