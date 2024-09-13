import { concrete, Error4xx, primary_session, session_token } from '@moodle/domain'
import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u, d_u__d, ok_ko } from '@moodle/lib-types'
import assert from 'assert'
import { user_id, user_session } from 'lib/domain/src/moodle/iam/v1_0'
import { userData } from '../types'

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
  const [valid, sessionResp] = await worker.moodle.iam.v1_0.sec.crypto.decryptToken({
    token: sessionToken,
  })
  const user_session =
    valid && sessionResp.v1_0 === 'userSession'
      ? ({
          type: 'authenticated',
          user: sessionResp.user,
        } satisfies user_session)
      : guest_session
  return user_session
}
const guest_session: lib_moodle_iam.v1_0.user_session = {
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
  role: lib_moodle_iam.v1_0.user_role,
  worker: concrete<'sec'>,
  assertError: Error4xx = new Error4xx('Unauthorized'),
) {
  const user_session = await assert_validateUserAuthenticatedSession(
    primarySession,
    worker,
    assertError,
  )
  lib_moodle_iam.v1_0.hasUserRole(user_session, role)
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

// GENERATE SESSION TOKEN

export async function generateSessionTokenForUserId(
  userId: user_id,
  worker: concrete<'sec'>,
): Promise<ok_ko<{ sessionToken: session_token }, d_u<{ userNotFound: unknown }, 'reason'>>> {
  const mySec = worker.moodle.iam.v1_0.sec
  const [, dbUser] = await mySec.db.getUserById({ userId })
  if (!dbUser) {
    return [false, { reason: 'userNotFound' }]
  }
  const sessionToken = await generateSessionTokenForUserData(userData(dbUser), worker)
  return [true, { sessionToken }]
}
export async function generateSessionTokenForUserData(
  user: lib_moodle_iam.v1_0.UserData,
  worker: concrete<'sec'>,
): Promise<session_token> {
  const mySec = worker.moodle.iam.v1_0.sec
  const {
    iam: { tokenExpireTime },
  } = await mySec.db.getConfigs()
  const { encrypted: sessionToken } = await mySec.crypto.encryptToken({
    data: {
      v1_0: 'userSession',
      user,
    },
    expires: tokenExpireTime.userSession,
  })
  return sessionToken
}
