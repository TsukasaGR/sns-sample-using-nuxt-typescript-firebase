import * as types from '../../../types'
import { update } from '../../firestore/util'

export default function handle(record: types.Record): Promise<types.Record> {
  return update<types.Record>('records', record)
}
