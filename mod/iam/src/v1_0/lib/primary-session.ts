import { CoreContext, ErrorXxx, primary_session } from '@moodle/lib-ddd'
import { d_u__d, ok_ko, signed_expire_token } from '@moodle/lib-types'
import assert from 'assert'
import { sessionUserData, user_id, user_role, user_session } from '../types'
import { hasUserSessionRole, userRecord2SessionUserData } from './user-session'

// System Session
export function isSystemSession(
  session: primary_session,
): session is d_u__d<primary_session, 'type', 'system'> {
  return session.type === 'system'
}
export function validateSystemSession(session: primary_session) {
  if (!isSystemSession(session)) {
    return null
  }

  return session
}
//

export async function validateAnyUserSession(ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>) {
  const token = ctx.primarySession.type === 'user' && ctx.primarySession.sessionToken
  if (!token) {
    return guest_session
  }
  const [valid, sessionResp] = await ctx.sysCall.moodle.iam.v1_0.sec.crypto.validateSignedToken({
    token,
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
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
) {
  if (ctx.primarySession.type !== 'user') {
    return null
  }
  const { sessionToken } = ctx.primarySession
  if (!sessionToken) {
    return null
  }
  const m_authenticated_user_session = await validateAnyUserSession(ctx)
  if (m_authenticated_user_session.type !== 'authenticated') {
    return null
  }
  return m_authenticated_user_session
}

/// Has User Role
export async function validateUserAuthenticatedSessionHasRole(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
  role: user_role,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  if (!(authenticated_user_session && hasUserSessionRole(authenticated_user_session, role))) {
    return null
  }

  return authenticated_user_session
}

// Assert Authorize
export async function assert_authorizeSystemSession(ctx: Pick<CoreContext, 'primarySession'>) {
  const system_session = validateSystemSession(ctx.primarySession)
  assert(system_session, new ErrorXxx('Unauthorized', 'assert_authorizeSystemSession'))
  return system_session
}

export async function assert_authorizeUserAuthenticatedSession(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', 'assert_authorizeUserAuthenticatedSession'),
  )
  return authenticated_user_session
}
export async function assert_authorizeUserSessionWithRole(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
  role: user_role,
) {
  const authenticated_user_session = await validateUserAuthenticatedSessionHasRole(ctx, role)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', `assert_authorizeUserSessionWithRole ${role}`),
  )
  return authenticated_user_session
}
export async function assert_authorizeAdminUserSession(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'admin')
}
export async function assert_authorizePublisherUserSession(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'publisher')
}
export async function assert_authorizeAuthenticatedUserSession(
  ctx: Pick<CoreContext, 'primarySession' | 'sysCall'>,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', 'assert_authorizeAuthenticatedUserSession'),
  )
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
  ctx: Pick<CoreContext, 'sysCall'>,
  userId: user_id,
): Promise<ok_ko<signed_expire_token, { userNotFound: unknown }>> {
  const mySec = ctx.sysCall.moodle.iam.v1_0.sec
  const [, userRecord] = await mySec.db.getUserById({ userId })
  if (!userRecord) {
    return [false, { reason: 'userNotFound' }]
  }
  const session = await generateSessionForUserData(ctx, userRecord2SessionUserData(userRecord))
  return [true, session]
}

export async function generateSessionForUserData(
  ctx: Pick<CoreContext, 'sysCall'>,
  user: sessionUserData,
): Promise<signed_expire_token> {
  const {
    configs: { tokenExpireTime },
  } = await ctx.sysCall.moodle.iam.v1_0.sec.db.getConfigs()
  const session = await ctx.sysCall.moodle.iam.v1_0.sec.crypto.signDataToken({
    data: {
      v: '1_0',
      type: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
