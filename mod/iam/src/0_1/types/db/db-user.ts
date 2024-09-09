import { d_u, date_time_string, email_address } from '@moodle/lib-types'
import { User } from '../data/user'

export type user_role = 'admin' | 'publisher'

export interface DbUser extends User {
  id: user_id
  passwordHash: user_password_hash
  activityStatus: {
    lastLogin: date_time_string
    inactiveNotificationSentAt: false | date_time_string
  }
  deletedAndAnonymizedAt:
    | false
    | {
        reason: user_deletion_reason
        at: date_time_string
      }
}
export type user_id = string
export type user_deletion_reason = { summary: string } & d_u<
  {
    inactivityPolicies: unknown
    userRequested: unknown
    adminRequested: unknown
    other: unknown
  },
  'reason'
>
export type user_plain_password = string
export type user_password_hash = string
export type id_or_email = user_id | email_address
