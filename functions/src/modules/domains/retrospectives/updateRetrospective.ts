import * as types from '../../../types'
import { update } from '../../firestore/util'

export default function handle(
  retrospective: types.Retrospective
): Promise<types.Retrospective> {
  return update<types.Retrospective>('retrospectives', retrospective)
}
