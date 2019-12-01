import * as types from '../../../types'
import { store } from '../../firestore/util'

export default function handle(
  teamDraft: types.TeamDraft
): Promise<types.Team> {
  return store<types.TeamDraft, types.Team>('teams', teamDraft)
}
