import { CoreContext, ErrorXxx, access_session } from '@moodle/lib-ddd'
import { d_u__d, ok_ko, signed_expire_token } from '@moodle/lib-types'
import assert from 'assert'
import { sessionUserData, user_id, user_role, user_session } from '../types'
import { hasUserSessionRole, user_record2SessionUserData } from './user-session'

// System Session
export function isSystemSession(
  session: access_session,
): session is d_u__d<access_session, 'type', 'system'> {
  return session.type === 'system'
}
export function validateSystemSession(session: access_session) {
  if (!isSystemSession(session)) {
    return null
  }

  return session
}
//

export async function validateAnyUserSession(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
) {
  const token = ctx.access_session.type === 'user' && ctx.access_session.sessionToken
  if (!token) {
    return guest_session
  }
  const [valid, validation] = await ctx.sys_call.moodle.iam.sec.crypto.validateSignedToken({
    token,
    type: 'userSession',
  })
  if (!valid) {
    return guest_session
  }
  const { validatedSignedTokenData } = validation

  const user_session: user_session = {
    type: 'authenticated',
    user: validatedSignedTokenData.user,
  }
  return user_session
}
const guest_session: user_session = {
  type: 'guest',
}

// Authenticated Session
export async function validateUserAuthenticatedSession(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
) {
  if (ctx.access_session.type !== 'user') {
    return null
  }
  const { sessionToken } = ctx.access_session
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
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
  role: user_role,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  if (!(authenticated_user_session && hasUserSessionRole(authenticated_user_session, role))) {
    return null
  }

  return authenticated_user_session
}

// Assert Authorize
export async function assert_authorizeSystemSession(ctx: Pick<CoreContext, 'access_session'>) {
  const system_session = validateSystemSession(ctx.access_session)
  assert(system_session, new ErrorXxx('Unauthorized', 'assert_authorizeSystemSession'))
  return system_session
}

export async function assert_authorizeUserAuthenticatedSession(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', 'assert_authorizeUserAuthenticatedSession'),
  )
  return authenticated_user_session
}
export async function assert_authorizeUserSessionWithRole(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
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
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'admin')
}
export async function assert_authorizeContributorUserSession(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'contributor')
}
export async function assert_authorizeAuthenticatedUserSession(
  ctx: Pick<CoreContext, 'access_session' | 'sys_call'>,
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
  session: access_session,
): session is d_u__d<access_session, 'type', 'user'> {
  return session.type === 'user'
}

export function isGuestSession(
  session: access_session,
): session is d_u__d<access_session, 'type', 'user'> {
  return isAnyUserSession(session) && !session.sessionToken
}

// GENERATE SESSION TOKEN

export async function generateSessionForUserId(
  ctx: Pick<CoreContext, 'sys_call'>,
  userId: user_id,
): Promise<ok_ko<signed_expire_token, { userNotFound: unknown }>> {
  const mySec = ctx.sys_call.moodle.iam.sec
  const [, user_record] = await mySec.db.getUserById({ userId })
  if (!user_record) {
    return [false, { reason: 'userNotFound' }]
  }
  const session = await generateSessionForUserData(ctx, user_record2SessionUserData(user_record))
  return [true, session]
}

export async function generateSessionForUserData(
  ctx: Pick<CoreContext, 'sys_call'>,
  user: sessionUserData,
): Promise<signed_expire_token> {
  const {
    configs: { tokenExpireTime },
  } = await ctx.sys_call.moodle.iam.sec.db.getConfigs()
  const session = await ctx.sys_call.moodle.iam.sec.crypto.signDataToken({
    data: {
      v: '1_0',
      type: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
