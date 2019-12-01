import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

export function storeRetrospective(
  retrospective: types.RetrospectiveDraft
): Promise<types.Retrospective | any> {
  return axios
    .post<apiTypes.StoreOrUpdateRetrospectiveSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RETROSPECTIVE}`,
      {
        retrospective,
      }
    )
    .then((res: AxiosResponse) => {
      return res.data.retrospective
    })
}

export function updateRetrospective(
  retrospective: types.Retrospective
): Promise<types.Retrospective | any> {
  return axios
    .put<apiTypes.StoreOrUpdateRetrospectiveSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RETROSPECTIVE}`,
      {
        retrospective,
      }
    )
    .then((res: AxiosResponse) => {
      return res.data.retrospective
    })
}

export function deleteRetrospective(retrospectiveId: string): Promise<void> {
  return axios
    .delete<apiTypes.DeleteRetrospectiveSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RETROSPECTIVE}?retrospectiveId=${retrospectiveId}`
    )
    .then((res: AxiosResponse) => {
      return res.data.record
    })
}
