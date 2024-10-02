import { d_u__d } from '@moodle/lib-types'
import { iam } from '@moodle/domain'

export function hasUserSessionRole(
  user_session: iam.user_session,
  role: iam.user_role,
): user_session is d_u__d<iam.user_session, 'type', 'authenticated'> {
  if (!isAuthenticatedUserSession(user_session)) {
    return false
  }
  return user_session.user.roles.includes(role)
}
export function isPublisherUserSession(user_session: iam.user_session) {
  return hasUserSessionRole(user_session, 'publisher')
}
export function isAdminUserSession(user_session: iam.user_session) {
  return hasUserSessionRole(user_session, 'admin')
}
//

// Authenticated Session
export function isAuthenticatedUserSession(
  user_session: iam.user_session,
): user_session is d_u__d<iam.user_session, 'type', 'authenticated'> {
  return user_session.type === 'authenticated'
}

// Guest Session
export function isGuestUserSession(
  user_session: iam.user_session,
): user_session is d_u__d<iam.user_session, 'type', 'guest'> {
  return user_session.type === 'guest'
}
;``
//
export function user_record2SessionUserData(
  user_record: Pick<iam.user_record, keyof iam.sessionUserData>,
): iam.sessionUserData {
  return {
    id: user_record.id,
    displayName: user_record.displayName,
    roles: user_record.roles,
    contacts: user_record.contacts,
  }
}
