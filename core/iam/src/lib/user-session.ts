import { iam } from '@moodle/domain'
import { d_u__d } from '@moodle/lib-types'

export function hasUserSessionRole(
  userSession: iam.userSession,
  role: iam.user_role,
): userSession is d_u__d<iam.userSession, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(userSession)) {
    return false
  }
  return userSession.user.roles.includes(role)
}
export function isPublisherUserSession(userSession: iam.userSession) {
  return hasUserSessionRole(userSession, 'publisher')
}
export function isAdminUserSession(userSession: iam.userSession) {
  return hasUserSessionRole(userSession, 'admin')
}
//

// Authenticated Session
export function isAuthenticatedUserSession(
  userSession: iam.userSession,
): userSession is d_u__d<iam.userSession, 'type', 'authenticated'> {
  return userSession.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(
  userSession: iam.userSession,
): userSession is d_u__d<iam.userSession, 'type', 'guest'> {
  return userSession.type === 'guest'
}
;``
//
export function user_record2SessionUserData(
  user_record: Pick<iam.user_record, keyof iam.userSessionData>,
): iam.userSessionData {
  return {
    id: user_record.id,
    displayName: user_record.displayName,
    roles: user_record.roles,
    contacts: user_record.contacts,
  }
}

export function userSessionInfo(userSession: iam.userSession): {
  authenticated:
    | false
    | (iam.AuthenticatedUserSession & {
        isAdmin: boolean
        isPublisher: boolean
      })
} {
  if (userSession.type === 'guest') {
    return { authenticated: false }
  }
  return {
    authenticated: {
      ...userSession,
      isAdmin: isAdminUserSession(userSession),
      isPublisher: isPublisherUserSession(userSession),
    },
  }
}
