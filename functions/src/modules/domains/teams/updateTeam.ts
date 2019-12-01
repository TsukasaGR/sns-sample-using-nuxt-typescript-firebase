import * as types from '../../../types'
import { update } from '../../firestore/util'

export default function handle(team: types.Team): Promise<types.Team> {
  return update<types.Team>('teams', team)
}
