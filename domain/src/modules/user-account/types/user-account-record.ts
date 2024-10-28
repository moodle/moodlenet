import type { d_u, date_time_string, email_address, time_duration_string } from '@moodle/lib-types'
import { password_hash } from '../../crypto/types'

// NOTE: roles will eventually be per-subsystem . e.g. export type userRole = 'moodle.net.admin' | 'moodle.net.contributor'
export type userRole = 'admin' | 'contributor'

export type userAccountId = string

export type userAccountRecord = {
  id: userAccountId
  creationDate: date_time_string
  //REVIEW: possibly replace `displayName` with a `user_profile_excerpt` type. (ATM userProfileRecord is created as a consequence of a new userAccountRecord creation whereas `displayName` is provided during signup.)
  displayName: string
  roles: userRole[]
  roleHistory: { date: date_time_string; by: userAccountId; oldRoles: userRole[]; newRoles: userRole[] }[]
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
        date: date_time_string
      }
}

export type userDeactivationReason = d_u<
  {
    inactivityPolicies: { notLoggedInFor: time_duration_string }
    userSelfDeletionRequest: { reason: string }
    adminRequest: { reason: string; adminUserAccountId: userAccountId }
  },
  'type'
>
