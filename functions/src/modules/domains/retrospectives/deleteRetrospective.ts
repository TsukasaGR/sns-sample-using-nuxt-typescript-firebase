import { deleteObjectFromObjectID } from '../../firestore/util'

export default function handle(retrospectiveId: string): Promise<void> {
  return deleteObjectFromObjectID('retrospectives', retrospectiveId)
}
