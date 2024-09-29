import { d_u__d } from '@moodle/lib-types'
import { sessionUserData, user_session } from '../types/user-session'
import { user_role, user_record } from '../types'

export function hasUserSessionRole(
  user_session: user_session,
  role: user_role,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(user_session)) {
    return false
  }
  return user_session.user.roles.includes(role)
}
export function isContributorUserSession(user_session: user_session) {
  return hasUserSessionRole(user_session, 'contributor')
}
export function isAdminUserSession(user_session: user_session) {
  return hasUserSessionRole(user_session, 'admin')
}
//

// Authenticated Session
export function isAuthenticatedUserSession(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'authenticated'> {
  return user_session.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(
  user_session: user_session,
): user_session is d_u__d<user_session, 'type', 'guest'> {
  return user_session.type === 'guest'
}
;``
//
export function user_record2SessionUserData(
  user_record: Pick<user_record, keyof sessionUserData>,
): sessionUserData {
  return {
    id: user_record.id,
    displayName: user_record.displayName,
    roles: user_record.roles,
    contacts: user_record.contacts,
  }
}
