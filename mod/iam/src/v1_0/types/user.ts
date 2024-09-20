import type { date_time_string, email_address } from '@moodle/lib-types'
import type { user_id, user_role } from './user-session'

export interface UserData {
  id: user_id
  createdAt: date_time_string
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
}
