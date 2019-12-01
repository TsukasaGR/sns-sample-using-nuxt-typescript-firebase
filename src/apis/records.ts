import axios, { AxiosResponse } from 'axios'
import * as types from '~/types/domainTypes'
import * as apiTypes from '~/types/apiTypes'
import * as apiConst from '~/constants/apis'

export function storeRecord(
  record: types.RecordDraft
): Promise<types.Record | any> {
  return axios
    .post<apiTypes.StoreOrUpdateRecordSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RECORD}`,
      {
        record,
      }
    )
    .then((res: AxiosResponse) => {
      return res.data.record
    })
}

export function updateRecord(
  record: types.Record
): Promise<types.Record | any> {
  return axios
    .put<apiTypes.StoreOrUpdateRecordSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RECORD}`,
      { record }
    )
    .then((res: AxiosResponse) => {
      return res.data.record
    })
}

export function deleteRecord(recordId: string): Promise<void> {
  return axios
    .delete<apiTypes.DeleteRecordSuccess>(
      `${process.env.apiBaseUrl}${apiConst.STORE_OR_UPDATE_RECORD}?recordId=${recordId}`
    )
    .then((res: AxiosResponse) => {
      return res.data.record
    })
}
