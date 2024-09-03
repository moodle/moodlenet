import { user } from '../types/0_1'

export function isGuest(user: user) {
  return user.type === 'guest'
}
