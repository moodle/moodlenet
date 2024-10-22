import type { d_u, date_time_string, email_address, time_duration_string } from '@moodle/lib-types'
import { password_hash } from '../../crypto/types'
import { userModerations } from '../../net/types/moderation'

// NOTE: roles will eventually be per-subsystem . e.g. export type user_role = 'moodle.net.admin' | 'moodle.net.publisher'
export type user_role = 'admin' | 'publisher'

export type user_id = string
export type userRecord = {
  id: user_id
  createdAt: date_time_string
  //REVIEW: possibly replace `displayName` with a `user_home_excerpt` type. (ATM userHomeRecord is created as a consequence of a new userRecord creation whereas `displayName` is provided during signup.)
  displayName: string
  roles: user_role[]
  roleHistory: { at: date_time_string; by: user_id; old_roles: user_role[]; new_roles: user_role[] }[]
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
  //REVIEW: `moodlenet` also raises concerns on these data in iam, may need `im` and `account`? .
  //REVIEW: or maybe there should be a `moodlenet user database`?
  //REVIEW: also notice we indeed have a `moodlenet` prop in userHomeRecord though....
  moodlenet: {
    moderation: userModerations
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
