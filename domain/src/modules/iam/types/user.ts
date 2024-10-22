import type { d_u, date_time_string, email_address, time_duration_string } from '@moodle/lib-types'
import { password_hash } from '../../crypto/types'
import { userModerations } from '../../net/types/moderation'

// NOTE: roles will eventually be per-subsystem . e.g. export type userRole = 'moodle.net.admin' | 'moodle.net.publisher'
export type userRole = 'admin' | 'publisher'

export type userId = string
export type userRecord = {
  id: userId
  createdAt: date_time_string
  //REVIEW: possibly replace `displayName` with a `user_profile_excerpt` type. (ATM userProfileRecord is created as a consequence of a new userRecord creation whereas `displayName` is provided during signup.)
  displayName: string
  roles: userRole[]
  roleHistory: { at: date_time_string; by: userId; oldRoles: userRole[]; newRoles: userRole[] }[]
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
        reason: userDeactivationReason
        at: date_time_string
      }
  //REVIEW: `moodlenet` also raises concerns on these data in iam, may need `im` and `account`? .
  //REVIEW: or maybe there should be a `moodlenet user database`?
  //REVIEW: also notice we indeed have a `moodlenet` prop in userProfileRecord though....
  moodlenet: {
    moderation: userModerations
  }
}

export type userDeactivationReason = d_u<
  {
    inactivityPolicies: { notLoggedInFor: time_duration_string }
    userSelfDeletionRequest: { reason: string }
    adminRequest: { reason: string; adminUserId: userId }
  },
  'type'
>
