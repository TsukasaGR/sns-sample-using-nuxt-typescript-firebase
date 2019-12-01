import { deleteObjectFromObjectID } from '../../firestore/util'

export default function handle(teamId: string): Promise<void> {
  return deleteObjectFromObjectID('teams', teamId)
}
