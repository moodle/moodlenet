import { user } from '../types'

export function isGuest(user: user) {
  return user.type === 'guest'
}
