import { d_u__d } from '@moodle/lib-types'
import { AuthenticatedUserSession, userRecord, userRole, userSession, userSessionData } from '../types'

export function hasUserSessionRole(
  userSession: userSession,
  role: userRole,
): userSession is d_u__d<userSession, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(userSession)) {
    return false
  }
  return userSession.user.roles.includes(role)
}
export function isPublisherUserSession(userSession: userSession) {
  return hasUserSessionRole(userSession, 'publisher')
}
export function isAdminUserSession(userSession: userSession) {
  return hasUserSessionRole(userSession, 'admin')
}
//

// Authenticated Session
export function isAuthenticatedUserSession(
  userSession: userSession,
): userSession is d_u__d<userSession, 'type', 'authenticated'> {
  return userSession.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(userSession: userSession): userSession is d_u__d<userSession, 'type', 'guest'> {
  return userSession.type === 'guest'
}
;``
//
export function userRecord2SessionUserData(userRecord: Pick<userRecord, keyof userSessionData>): userSessionData {
  return {
    id: userRecord.id,
    displayName: userRecord.displayName,
    roles: userRecord.roles,
    contacts: userRecord.contacts,
  }
}

export function userSessionInfo(userSession: userSession): {
  authenticated:
    | false
    | (AuthenticatedUserSession & {
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
