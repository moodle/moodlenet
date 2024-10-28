import { d_u__d } from '@moodle/lib-types'
import {
  AuthenticatedUserSession,
  profileSessionData,
  userAccountRecord,
  userRole,
  userSession,
  userSessionData,
  userSessionInfo,
} from '../types'
import { userProfileRecord } from '../../user-profile'

export function hasUserSessionRole(
  userSession: userSession,
  role: userRole,
): userSession is d_u__d<userSession, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(userSession)) {
    return false
  }
  return userSession.user.roles.includes(role)
}
// export function isContributorUserSession(userSession: userSession) {
//   return hasUserSessionRole(userSession, 'contributor')
// }
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


export function userSessionInfo(userSession: userSession): userSessionInfo {
  if (userSession.type === 'guest') {
    return { authenticated: false }
  }
  return {
    authenticated: {
      ...userSession,
      isAdmin: isAdminUserSession(userSession),
      // isContributor: isContributorUserSession(userSession),
    },
  }
}
