import { iam, moodle_core_context } from '@moodle/domain'
import { access_session, ErrorXxx } from '@moodle/lib-ddd'
import { d_u__d, ok_ko, signed_expire_token } from '@moodle/lib-types'
import assert from 'assert'
import { hasUserSessionRole, user_record2SessionUserData, userSessionInfo } from './user-session'

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
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
) {
  const token = ctx.access_session.type === 'user' && ctx.access_session.sessionToken
  if (!token) {
    return guest_session
  }
  const [valid, validation] = await ctx.sys_call.secondary.iam.crypto.validateSignedToken({
    token,
    type: 'userSession',
  })
  if (!valid) {
    return guest_session
  }
  const { validatedSignedTokenData } = validation

  const user_session: iam.user_session = {
    type: 'authenticated',
    user: validatedSignedTokenData.user,
  }
  return user_session
}
const guest_session: iam.user_session = {
  type: 'guest',
}

export async function validate_userSessionInfo(ctx: moodle_core_context) {
  const user_session = await validateAnyUserSession(ctx)
  return userSessionInfo(user_session)
}

// Authenticated Session
export async function validateUserAuthenticatedSession(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
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
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
  role: iam.user_role,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  if (!(authenticated_user_session && hasUserSessionRole(authenticated_user_session, role))) {
    return null
  }

  return authenticated_user_session
}

// Assert Authorize
export async function assert_authorizeSystemSession(
  ctx: Pick<moodle_core_context, 'access_session'>,
) {
  const system_session = validateSystemSession(ctx.access_session)
  assert(system_session, new ErrorXxx('Unauthorized', 'assert_authorizeSystemSession'))
  return system_session
}

export async function assert_authorizeUserAuthenticatedSession(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
) {
  const authenticated_user_session = await validateUserAuthenticatedSession(ctx)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', 'assert_authorizeUserAuthenticatedSession'),
  )
  return authenticated_user_session
}
export async function assert_authorizeUserSessionWithRole(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
  role: iam.user_role,
) {
  const authenticated_user_session = await validateUserAuthenticatedSessionHasRole(ctx, role)
  assert(
    authenticated_user_session,
    new ErrorXxx('Unauthorized', `assert_authorizeUserSessionWithRole ${role}`),
  )
  return authenticated_user_session
}
export async function assert_authorizeAdminUserSession(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'admin')
}
export async function assert_authorizePublisherUserSession(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
) {
  return assert_authorizeUserSessionWithRole(ctx, 'publisher')
}
export async function assert_authorizeAuthenticatedUserSession(
  ctx: Pick<moodle_core_context, 'access_session' | 'sys_call'>,
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
  ctx: Pick<moodle_core_context, 'sys_call'>,
  userId: iam.user_id,
): Promise<ok_ko<signed_expire_token, { userNotFound: unknown }>> {
  const mySec = ctx.sys_call.secondary.iam
  const [, user_record] = await mySec.db.getUserById({ userId })
  if (!user_record) {
    return [false, { reason: 'userNotFound' }]
  }
  const session = await generateSessionForUserData(ctx, user_record2SessionUserData(user_record))
  return [true, session]
}

export async function generateSessionForUserData(
  ctx: Pick<moodle_core_context, 'sys_call'>,
  user: iam.sessionUserData,
): Promise<signed_expire_token> {
  const {
    configs: { tokenExpireTime },
  } = await ctx.sys_call.secondary.iam.db.getConfigs()
  const session = await ctx.sys_call.secondary.iam.crypto.signDataToken({
    data: {
      v: '1_0',
      type: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
