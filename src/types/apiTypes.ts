import * as types from '~/types/domainTypes'

export type StoreOrUpdateGoalSuccess = {
  goal: types.Goal
}
export type StoreOrUpdateRecordSuccess = {
  record: types.Record
}
export type DeleteRecordSuccess = {
  message: string
}
export type StoreOrUpdateRetrospectiveSuccess = {
  retrospective: types.Retrospective
}
export type DeleteRetrospectiveSuccess = {
  message: string
}
export type StoreOrUpdateUserSuccess = {
  user: types.User
}
export type StoreOrUpdateTeamSuccess = {
  team: types.Team
}
export type DeleteTeamSuccess = {
  message: string
}
