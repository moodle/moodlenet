import { concrete, Error4xx, primary_session, session_token } from '@moodle/domain'
import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u__d } from '@moodle/lib-types'
import assert from 'assert'
import { user_session } from 'lib/domain/src/moodle/iam/v0_1'

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

export async function getUserSession(sessionToken: session_token, worker: concrete<'sec'>) {
  const [valid, sessionResp] = await worker.moodle.iam.v0_1.sec.crypto.decryptToken({
    token: sessionToken,
  })
  const user_session =
    valid && sessionResp.v0_1 === 'userSession'
      ? ({
          type: 'authenticated',
          user: sessionResp.user,
        } satisfies user_session)
      : guest_session
  return user_session
}
const guest_session: lib_moodle_iam.v0_1.user_session = {
  type: 'guest',
}

// Authenticated Session
export async function assert_validateUserAuthenticatedSession(
  primarySession: primary_session,
  worker: concrete<'sec'>,
  assertError: Error4xx = new Error4xx('Unauthorized'),
) {
  assert(primarySession.type === 'user', assertError)
  const { sessionToken } = primarySession
  assert(sessionToken, assertError)
  const user_session = await getUserSession(sessionToken, worker)
  assert(user_session.type === 'authenticated', assertError)

  return user_session
}

/// Has User Role
export async function assert_validateUserAuthenticatedSessionHasRole(
  primarySession: primary_session,
  role: lib_moodle_iam.v0_1.user_role,
  worker: concrete<'sec'>,
  assertError: Error4xx = new Error4xx('Unauthorized'),
) {
  const user_session = await assert_validateUserAuthenticatedSession(
    primarySession,
    worker,
    assertError,
  )
  lib_moodle_iam.v0_1.hasUserRole(user_session, role)
  return user_session
}

// GUEST
export function isGuestSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'user'> {
  return session.type === 'user'
}
export function assertGuestSession(
  session: primary_session,
  assertError: Error4xx = new Error4xx('Unauthorized'),
): asserts session is d_u__d<primary_session, 'type', 'user'> {
  assert(isGuestSession(session) && !session.sessionToken, assertError)
}
