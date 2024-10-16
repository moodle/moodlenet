import { ok_ko, signed_expire_token } from '@moodle/lib-types'
import assert from 'assert'
import { contextModuleAccess, coreContext, ErrorXxx, primaryContext } from '../../../types'
import { user_id, user_role, userSession, userSessionData } from '../types'
import { hasUserSessionRole, user_record2SessionUserData, userSessionInfo } from './user-session'

// System Session
export type sessionLibDep = {
  coreCtx: { mod: contextModuleAccess }
  priCtx: Pick<primaryContext, 'session'>
}
export type sessionLibDepWithRole = sessionLibDep & { role: user_role }

export async function validateAnyUserSession({ coreCtx, priCtx }: sessionLibDep) {
  if (!priCtx.session.token) {
    return guest_session
  }
  const [valid, validation] = await coreCtx.mod.iam.service.validateSignedToken({
    token: priCtx.session.token,
    type: 'userSession',
  })
  if (!valid) {
    return guest_session
  }
  const { validatedSignedTokenData } = validation

  const userSession: userSession = {
    type: 'authenticated',
    user: validatedSignedTokenData.user,
  }
  return userSession
}
const guest_session: userSession = {
  type: 'guest',
}

export async function validate_userSessionInfo({ coreCtx, priCtx }: sessionLibDep) {
  const userSession = await validateAnyUserSession({ coreCtx, priCtx })
  return userSessionInfo(userSession)
}

// Authenticated Session
export async function validateUserAuthenticatedSession({ coreCtx, priCtx }: sessionLibDep) {
  const m_authenticated_userSession = await validateAnyUserSession({ coreCtx, priCtx })
  if (m_authenticated_userSession.type !== 'authenticated') {
    return null
  }
  return m_authenticated_userSession
}

/// Has User Role
export async function validateUserAuthenticatedSessionHasRole({ role, ...dep }: sessionLibDepWithRole) {
  const authenticated_userSession = await validateUserAuthenticatedSession(dep)
  if (!(authenticated_userSession && hasUserSessionRole(authenticated_userSession, role))) {
    return null
  }

  return authenticated_userSession
}

// Assert Authorize

export async function assert_authorizeUserAuthenticatedSession(dep: sessionLibDep) {
  const authenticated_userSession = await validateUserAuthenticatedSession(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', 'assert_authorizeUserAuthenticatedSession'))
  return authenticated_userSession
}
export async function assert_authorizeUserSessionWithRole(dep: sessionLibDepWithRole) {
  const authenticated_userSession = await validateUserAuthenticatedSessionHasRole(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', `assert_authorizeUserSessionWithRole ${dep.role}`))
  return authenticated_userSession
}

export async function assert_authorizeAuthenticatedUserSession(dep: sessionLibDep) {
  const authenticated_userSession = await validateUserAuthenticatedSession(dep)
  assert(authenticated_userSession, new ErrorXxx('Unauthorized', 'assert_authorizeAuthenticatedUserSession'))
  return authenticated_userSession
}

// GUEST

// export function isGuestSession({ primarySession }: { primarySession: primarySession }) {
//   return !priCtx.primarySession.token
// }

// GENERATE SESSION TOKEN

export async function generateSessionForUserId({
  coreCtx,
  userId,
}: {
  coreCtx: Pick<coreContext<never>, 'mod'>
  userId: user_id
}): Promise<ok_ko<{ userSessionToken: signed_expire_token }, { userNotFound: unknown }>> {
  const [, user_record] = await coreCtx.mod.iam.query.userBy({ by: 'id', userId })
  if (!user_record) {
    return [false, { reason: 'userNotFound' }]
  }
  const userSessionToken = await generateSessionForUserData({
    coreCtx,
    user: user_record2SessionUserData(user_record),
  })
  return [true, { userSessionToken }]
}

export async function generateSessionForUserData({ coreCtx, user }: { coreCtx: Pick<coreContext<never>, 'mod'>; user: userSessionData }): Promise<signed_expire_token> {
  const {
    configs: { tokenExpireTime },
  } = await coreCtx.mod.env.query.modConfigs({ mod: 'iam' })
  const session = await coreCtx.mod.iam.service.signDataToken({
    data: {
      v: '1_0',
      type: 'userSession',
      user,
    },
    expiresIn: tokenExpireTime.userSession,
  })
  return session
}
