import { email_address } from '@moodle/lib-types'
export type user_id = string
export type user_role = 'admin' | 'publisher'

export interface UserData {
  id: user_id
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
}
