import { d_u, email_address } from '@moodle/lib-types'
import { user_role } from '../db/db-user'

export type user_session = d_u<SessionTypes, 'type'>

interface SessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export interface AuthenticatedSession {
  id: string
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
}
