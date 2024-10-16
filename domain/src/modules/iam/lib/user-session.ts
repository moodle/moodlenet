import { d_u__d } from '@moodle/lib-types'
import { AuthenticatedUserSession, user_record, user_role, userSession, userSessionData } from '../types'

export function hasUserSessionRole(userSession: userSession, role: user_role): userSession is d_u__d<userSession, 'type', 'authenticated'> {
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
export function isAuthenticatedUserSession(userSession: userSession): userSession is d_u__d<userSession, 'type', 'authenticated'> {
  return userSession.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(userSession: userSession): userSession is d_u__d<userSession, 'type', 'guest'> {
  return userSession.type === 'guest'
}
;``
//
export function user_record2SessionUserData(user_record: Pick<user_record, keyof userSessionData>): userSessionData {
  return {
    id: user_record.id,
    displayName: user_record.displayName,
    roles: user_record.roles,
    contacts: user_record.contacts,
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
