import type { d_u, date_time_string, time_duration_string } from '@moodle/lib-types'
import type { UserData } from './user'
import { v1_0 } from './configs'

export interface DbUser extends UserData {
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

export type user_deactivation_reason = v1_0 &
  d_u<
    {
      inactivityPolicies: { notLoggedInFor: time_duration_string }
      userSelfDeletionRequest: { reason: string }
      adminRequest: { reason: string }
    },
    'type'
  >

export type user_plain_password = string
export type user_password_hash = string
// export type id_or_email = user_id | email_address
