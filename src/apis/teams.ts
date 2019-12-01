import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

export function storeTeam(team: types.TeamDraft): Promise<types.Team | any> {
  return axios
    .post<apiTypes.StoreOrUpdateTeamSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_TEAM}`,
      { team }
    )
    .then((res: AxiosResponse) => {
      return res.data.team
    })
}

export function updateTeam(team: types.Team): Promise<types.Team | any> {
  return axios
    .put<apiTypes.StoreOrUpdateTeamSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_TEAM}`,
      { team }
    )
    .then((res: AxiosResponse) => {
      return res.data.team
    })
}

export function deleteTeam(teamId: string): Promise<void> {
  return axios
    .delete<apiTypes.DeleteTeamSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_TEAM}?teamId=${teamId}`
    )
    .then((res: AxiosResponse) => {
      return res.data.team
    })
}
