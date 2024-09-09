import { email_address } from '@moodle/lib-types'

export interface User {
  displayName: string
  password: string
  email: email_address
  role: role
  lastLogin: {
    at: string
  }
}
type role = string
