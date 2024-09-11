import { concrete, Error4xx, primary_session, status4xx } from '@moodle/domain'
import { d_u__d } from '@moodle/lib-types'
import assert from 'assert'
import { user_role } from '../../types'
import { assertHasUserRole } from '../js'

// System Session
export function isSystemSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'system'> {
  return session.type === 'system'
}
export function assertSystemSession(
  session: primary_session,
): asserts session is d_u__d<primary_session, 'type', 'system'> {
  assert(isSystemSession(session), new Error4xx(`Forbidden`, `System session required`))
}
//

// User Session
export function isUserSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'user'> {
  return session.type === 'user'
}
export function assertUserSession(
  session: primary_session,
): asserts session is d_u__d<primary_session, 'type', 'user'> {
  assert(isUserSession(session), new Error4xx(`Forbidden`, `User session required`))
}

// Guest Session
export function isGuestSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'user'> {
  return session.type === 'user' && !session.authToken
}
export function assertGuestSession(
  session: primary_session,
): asserts session is d_u__d<primary_session, 'type', 'user'> {
  assert(isGuestSession(session), new Error4xx(`Forbidden`, `Guest session required`))
}

// Authenticated Session
export async function async_assertUserAuthenticatedSession(
  primarySession: primary_session,
  worker: concrete<'sec'>,
  onFail?: { code_or_desc: status4xx; details?: string },
) {
  const user_session = await worker.moodle.iam.v0_1.sec.crypto.assertAuthenticatedUserSession({
    token_or_session: primarySession,
    onFail,
  })
  return user_session
}

/// Has User Role
export async function async_assertUserAuthenticatedSessionHasRole(
  primarySession: primary_session,
  role: user_role,
  worker: concrete<'sec'>,
) {
  const user_session = await async_assertUserAuthenticatedSession(primarySession, worker)
  assertHasUserRole(user_session, role)
  return user_session
}

//
