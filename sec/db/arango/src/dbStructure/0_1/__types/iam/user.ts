import { Email } from '../common'

export interface User {
  displayName: string
  password: string
  email: Email
  role: role
  lastLogin: {
    at: string
  }
}
type role = string
