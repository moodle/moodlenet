import { d_u } from '@moodle/lib-types'
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
