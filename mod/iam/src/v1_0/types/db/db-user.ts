import { lib_moodle_iam } from '@moodle/lib-domain'
import { d_u, date_time_string, time_duration_string } from '@moodle/lib-types'

export function userData(
  dbUser: Pick<DbUser, keyof lib_moodle_iam.v1_0.UserData>,
): lib_moodle_iam.v1_0.UserData {
  return {
    contacts: dbUser.contacts,
    displayName: dbUser.displayName,
    id: dbUser.id,
    roles: dbUser.roles,
  }
}
export interface DbUser extends lib_moodle_iam.v1_0.UserData {
  passwordHash: user_password_hash
  activityStatus: {
    lastLogin: date_time_string
    inactiveNotificationSentAt: false | date_time_string
  }
  deactivated:
    | false
    | {
        anonymized: boolean
        reason: user_deactivation_reason
        at: date_time_string
      }
}

export type user_deactivation_reason = d_u<
  {
    inactivityPolicies: { notLoggedInFor: time_duration_string }
    userSelfDeletionRequest: { reason: string }
    adminRequest: { reason: string }
  },
  'v1_0'
>

export type user_plain_password = string
export type user_password_hash = string
// export type id_or_email = user_id | email_address
