import { user_session } from '../types'

export function isGuest(user: user_session) {
  return user.type === 'guest'
}
