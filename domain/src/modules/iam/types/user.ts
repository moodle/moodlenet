import type { d_u, date_time_string, email_address, time_duration_string } from '@moodle/lib-types'
import { password_hash } from '../../crypto/types'

// NOTE: roles will eventually be per-subsystem . e.g. export type user_role = 'moodle.net.admin' | 'moodle.net.publisher'
export type user_role = 'admin' | 'publisher'

export type user_id = string
export type userRecord = {
  id: user_id
  createdAt: date_time_string
  roles: user_role[]
  //REVIEW: possibly replace `displayName` with a `user_home_excerpt` type. (ATM userHomeRecord is created as a consequence of a new userRecord creation whereas `displayName` is provided during signup.)
  displayName: string
  contacts: {
    email: email_address
  }
  passwordHash: password_hash
  activityStatus: {
    // REVIEW: move to a specific module?
    lastLogin: date_time_string
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
    adminRequest: { reason: string; adminUserId: user_id }
  },
  'type'
>
