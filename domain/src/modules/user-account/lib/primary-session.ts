import { ok_ko, signed_expire_token } from '@moodle/lib-types'
import assert from 'assert'
import { baseContext, ErrorXxx, primaryContext } from '../../../types'
import { profileSessionData, userAccountId, userRole, userSession, userSessionData } from '../types'
import { hasUserSessionRole, userSessionInfo } from './user-session'

// System Session
export type sessionLibDep = {
  ctx: Pick<primaryContext, 'session' | 'mod'>
}
export type sessionLibDepWithRole = sessionLibDep & { role: userRole }

export async function validateCurrentUserSession({ ctx }: sessionLibDep) {
  if (!ctx.session.token) {
    return guest_session
  }
  const [valid, validation] = await ctx.mod.secondary.crypto.service.validateSignedToken({
    token: ctx.session.token,
    module: 'userAccount',
    type: 'userSession',
  })
  if (!valid) {
    return guest_session
  }
  const { validatedSignedTokenData } = validation

  const userSession: userSession = {
    type: 'authenticated',
    user: validatedSignedTokenData.user,
    profile: validatedSignedTokenData.profile,
  }
  return userSession
}
const guest_session: userSession = {
  type: 'guest',
}

export async function validate_currentUserSessionInfo({ ctx }: sessionLibDep) {
  const userSession = await validateCurrentUserSession({ ctx })
  return userSessionInfo(userSession)
}

// Authenticated Session
export async function validateCurrentUserAuthenticatedSession({ ctx }: sessionLibDep) {
  const m_authenticated_userSession = await validateCurrentUserSession({ ctx })
  if (m_authenticated_userSession.type !== 'authenticated') {
    return null
  }
  return m_authenticated_userSession
}

/// Has User Role
export async function validateCurrentUserAuthenticatedSessionHasRole({ role, ...dep }: sessionLibDepWithRole) {
  const authenticated_userSession = await validateCurrentUserAuthenticatedSession(dep)
  if (!(authenticated_userSession && hasUserSessionRole(authenticated_userSession, role))) {
    return null
  }

  return authenticated_userSession
}

// Assert Authorize

export async function assert_authorizeCurrentUserAuthenticatedSession(dep: sessionLibDep) {
  const authenticated_userSession = await validateCurrentUserAuthenticatedSession(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', 'assert_authorizeUserAuthenticatedSession'))
  return authenticated_userSession
}
export async function assert_authorizeCurrentUserSessionWithRole(dep: sessionLibDepWithRole) {
  const authenticated_userSession = await validateCurrentUserAuthenticatedSessionHasRole(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', `assert_authorizeUserSessionWithRole ${dep.role}`))
  return authenticated_userSession
}

export async function assert_authorizeAuthenticatedCurrentUserSession(dep: sessionLibDep) {
  const authenticated_userSession = await validateCurrentUserAuthenticatedSession(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', 'assert_authorizeAuthenticatedUserSession'))
  return authenticated_userSession
}

// GUEST

// export function isGuestSession({ primarySession }: { primarySession: primarySession }) {
//   return !priCtx.primarySession.token
// }

// GENERATE SESSION TOKEN

export async function generateSessionForUserAccountId({
  ctx,
  userAccountId,
}: {
  ctx: Pick<baseContext, 'mod'>
  userAccountId: userAccountId
}): Promise<ok_ko<{ userSessionToken: signed_expire_token }, { userNotFound: unknown; profileNotFound: unknown }>> {
  const [, userAccountRecord] = await ctx.mod.secondary.userAccount.query.userBy({ by: 'id', userAccountId })
  if (!userAccountRecord) {
    return [false, { reason: 'userNotFound' }]
  }
  const [userProfilefound, userProfileResult] = await ctx.mod.secondary.userProfile.query.getUserProfile({
    by: 'userAccountId',
    userAccountId: userAccountRecord.id,
  })
  if (!userProfilefound) {
    throw [false, { reason: 'profileNotFound' }]
  }
  const userSessionToken = await generateSessionTokenForUserAndProfileData({
    ctx,
    user: {
      id: userAccountRecord.id,
      roles: userAccountRecord.roles,
      contacts: userAccountRecord.contacts,
    },
    profile: {
      id: userProfileResult.userProfileRecord.id,
    },
  })
  return [true, { userSessionToken }]
}

async function generateSessionTokenForUserAndProfileData({
  ctx,
  user,
  profile,
}: {
  ctx: Pick<baseContext, 'mod'>
  user: userSessionData
  profile: profileSessionData
}): Promise<signed_expire_token> {
  const {
    configs: { tokenExpireTime },
  } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'userAccount' })

  const sessionToken = await ctx.mod.secondary.crypto.service.signDataToken({
    data: {
      module: 'userAccount',
      type: 'userSession',
      user,
      profile,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return sessionToken
}
