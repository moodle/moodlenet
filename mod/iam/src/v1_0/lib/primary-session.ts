import { concrete, Error4xx, primary_session, session_token } from '@moodle/domain'
import { d_u, d_u__d, ok_ko } from '@moodle/lib-types'
import assert from 'assert'
import { session_obj, user_id, user_role, user_session, UserData } from '../types'
import { dbUser2UserData } from './dbUser'
import { hasUserSessionRole } from './user-session'

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
  const [valid, sessionResp] = await worker.moodle.iam.v1_0.sec.crypto.decryptSession({
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
const guest_session: user_session = {
  type: 'guest',
}

// Authenticated Session
export async function assert_validateUserAuthenticatedSession(
  primarySession: primary_session,
  worker: concrete<'sec'>,
  assertError: Error4xx = new Error4xx('Forbidden'),
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
  role: user_role,
  worker: concrete<'sec'>,
  assertError: Error4xx = new Error4xx('Forbidden'),
) {
  const user_session = await assert_validateUserAuthenticatedSession(
    primarySession,
    worker,
    assertError,
  )
  hasUserSessionRole(user_session, role)
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

export async function generateSessionForUserId(
  userId: user_id,
  worker: concrete<'sec'>,
): Promise<ok_ko<session_obj, d_u<{ userNotFound: unknown }, 'reason'>>> {
  const mySec = worker.moodle.iam.v1_0.sec
  const [, dbUser] = await mySec.db.getUserById({ userId })
  if (!dbUser) {
    return [false, { reason: 'userNotFound' }]
  }
  const session = await generateSessionForUserData(dbUser2UserData(dbUser), worker)
  return [true, session]
}

export async function generateSessionForUserData(
  user: UserData,
  worker: concrete<'sec'>,
): Promise<session_obj> {
  const mySec = worker.moodle.iam.v1_0.sec
  const {
    iam: { tokenExpireTime },
  } = await mySec.db.getConfigs()
  const session = await mySec.crypto.encryptSession({
    data: {
      v1_0: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
