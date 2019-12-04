import { User } from '~/types/domainTypes'

export function icon(user: User | undefined): string {
  const noImage: string = require('~/assets/images/no_image.png')
  return user && user.icon ? user.icon : noImage
}
