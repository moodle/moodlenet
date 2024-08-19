import { user } from '../session/types/user'

export function isGuest(user: user) {
  return user.t === 'guest'
}
