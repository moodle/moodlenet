import { Error4xx } from '@moodle/domain'
import { d_u__d } from '@moodle/lib-types'
import assert from 'assert'
import { user_role, user_session } from './types'

export function assertHasUserRole(
  user_session: user_session,
  role: user_role,
): asserts user_session is d_u__d<user_session, 'type', 'authenticated'> {
  assert(hasUserRole(user_session, role), new Error4xx('Unauthorized', `User role must be ${role}`))
}
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
export function assertAuthenticated(
  user_session: user_session,
): asserts user_session is d_u__d<user_session, 'type', 'authenticated'> {
  assert(isAuthenticated(user_session), new Error4xx('Unauthorized', `Authenticated user required`))
}
export function isAuthenticated(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  return user_session.type === 'authenticated'
}

// Guest Session
export function assertGuest(
  user_session: user_session,
): asserts user_session is d_u__d<user_session, 'type', 'guest'> {
  assert(isGuest(user_session), new Error4xx('Unauthorized', `Guest user required`))
}
export function isGuest(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'guest'> {
  return user_session.type === 'guest'
}
//
