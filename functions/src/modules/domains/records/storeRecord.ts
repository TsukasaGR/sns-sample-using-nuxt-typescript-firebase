import * as types from '../../../types'
import { store } from '../../firestore/util'

export default function handle(
  recordDraft: types.RecordDraft
): Promise<types.Record> {
  return store<types.RecordDraft, types.Record>('records', recordDraft)
}
