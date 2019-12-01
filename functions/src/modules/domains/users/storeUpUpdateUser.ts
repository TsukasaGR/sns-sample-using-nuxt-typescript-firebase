import * as types from '../../../types'
import { update } from '../../firestore/util'

export default async function handle(user: types.User): Promise<types.User> {
  await update<types.User>('users', user)
  return user
}
