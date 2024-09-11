import { email_address } from '@moodle/lib-types'
import { user_id, user_role } from '../db/db-user'

export interface UserData {
  id: user_id
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
}
