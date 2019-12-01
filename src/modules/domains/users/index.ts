import * as types from '~/types/domainTypes'

export function isAdmin(user: types.User): boolean {
  return user.role === 'admin'
}
