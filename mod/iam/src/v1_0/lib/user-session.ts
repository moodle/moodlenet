import { d_u__d } from '@moodle/lib-types'
import { user_role, user_session } from '../types/user-session'

export function hasUserSessionRole(
  user_session: user_session,
  role: user_role,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(user_session)) {
    return false
  }
  return user_session.user.roles.includes(role)
}
//

// Authenticated Session
export function isAuthenticatedUserSession(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  return user_session.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'guest'> {
  return user_session.type === 'guest'
}
//
