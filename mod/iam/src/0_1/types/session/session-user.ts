import { d_u, email_address } from '@moodle/lib-types'
import { user_role } from '../db/db-user'
import { UserData } from '../data/user'

export type user_session = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export interface AuthenticatedSession {
  user: UserData
}
