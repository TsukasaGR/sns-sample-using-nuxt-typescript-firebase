import { deleteObjectFromObjectID } from '../../firestore/util'

export default function handle(recordId: string): Promise<void> {
  return deleteObjectFromObjectID('records', recordId)
}
