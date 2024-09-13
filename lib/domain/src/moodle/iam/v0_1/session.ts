import { d_u__d } from '@moodle/lib-types'
import { user_role, user_session } from './types'

export function hasUserRole(
  user_session: user_session,
  role: user_role,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  if (!isAuthenticated(user_session)) {
    return false
  }
  return user_session.user.roles.includes(role)
}
//

// Authenticated Session
export function isAuthenticated(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  return user_session.type === 'authenticated'
}

// Guest Session
export function isGuestSession(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'guest'> {
  return user_session.type === 'guest'
}
//
