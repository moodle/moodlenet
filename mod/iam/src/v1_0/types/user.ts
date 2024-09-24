import type {
  branded,
  d_u,
  date_time_string,
  email_address,
  time_duration_string,
} from '@moodle/lib-types'
import { v1_0 } from './configs'

export type user_role = 'admin' | 'publisher'
export interface UserRecord {
  id: user_id
  createdAt: date_time_string
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
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
      adminRequest: { reason: string; adminUserId: user_id }
    },
    'type'
  >

export const user_record_brand = Symbol('user_record')
export type user_id = string
export type userRecord = branded<UserRecord, typeof user_record_brand>

export type user_plain_password = string
export type user_password_hash = string
