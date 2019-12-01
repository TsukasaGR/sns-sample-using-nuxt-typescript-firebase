import * as types from '../../../types'
import { store } from '../../firestore/util'

export default function handle(
  retrospectiveDraft: types.RetrospectiveDraft
): Promise<types.Retrospective> {
  return store<types.RetrospectiveDraft, types.Retrospective>(
    'retrospectives',
    retrospectiveDraft
  )
}
