import { concrete, primary_session, session_token } from '@moodle/lib-ddd'
import { d_u, d_u__d, ok_ko } from '@moodle/lib-types'
import { session_obj, sessionUserData, user_id, user_role, user_session } from '../types'
import { hasUserSessionRole, userRecord2SessionUserData } from './user-session'

// System Session
export function isSystemSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'system'> {
  return session.type === 'system'
}
//

export async function validateAnyUserSession(sessionToken: session_token, worker: concrete<'sec'>) {
  const [valid, sessionResp] = await worker.moodle.iam.v1_0.sec.crypto.decryptTokenData({
    token: sessionToken,
  })
  const any_user_session =
    valid && sessionResp.type === 'userSession'
      ? ({
          type: 'authenticated',
          user: sessionResp.user,
        } satisfies user_session)
      : guest_session
  return any_user_session
}
const guest_session: user_session = {
  type: 'guest',
}

// Authenticated Session
export async function validateUserAuthenticatedSession(
  primarySession: primary_session,
  worker: concrete<'sec'>,
) {
  if (primarySession.type !== 'user') {
    return null
  }
  const { sessionToken } = primarySession
  if (!sessionToken) {
    return null
  }
  const any_user_session = await validateAnyUserSession(sessionToken, worker)
  if (any_user_session.type !== 'authenticated') {
    return null
  }
  return any_user_session
}

/// Has User Role
export async function validateUserAuthenticatedSessionHasRole(
  primarySession: primary_session,
  role: user_role,
  worker: concrete<'sec'>,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(primarySession, worker)
  if (!(authenticated_user_session && hasUserSessionRole(authenticated_user_session, role))) {
    return null
  }

  return authenticated_user_session
}

// GUEST
export function isAnyUserSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'user'> {
  return session.type === 'user'
}

export function isGuestSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'user'> {
  return isAnyUserSession(session) && !session.sessionToken
}

// GENERATE SESSION TOKEN

export async function generateSessionForUserId(
  userId: user_id,
  worker: concrete<'sec'>,
): Promise<ok_ko<session_obj, d_u<{ userNotFound: unknown }, 'reason'>>> {
  const mySec = worker.moodle.iam.v1_0.sec
  const [, userRecord] = await mySec.db.getUserById({ userId })
  if (!userRecord) {
    return [false, { reason: 'userNotFound' }]
  }
  const session = await generateSessionForUserData(userRecord2SessionUserData(userRecord), worker)
  return [true, session]
}

export async function generateSessionForUserData(
  user: sessionUserData,
  worker: concrete<'sec'>,
): Promise<session_obj> {
  const mySec = worker.moodle.iam.v1_0.sec
  const {
    iam: { tokenExpireTime },
  } = await mySec.db.getConfigs()
  const session = await mySec.crypto.encryptTokenData({
    data: {
      v: '1_0',
      type: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
