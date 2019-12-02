import { User, UserDraft } from '../../types'
import { store, update } from '../firestore/util'

export function storeUser(userDraft: UserDraft): Promise<User> {
  return store<UserDraft, User>('users', userDraft)
}

export function updateUser(user: User): Promise<User> {
  return update<User>('users', user)
}
