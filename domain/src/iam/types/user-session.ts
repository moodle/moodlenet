import type { d_u } from '@moodle/lib-types'
import { user_record } from './user'

export type user_session = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export type sessionUserData = Pick<user_record, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedSession {
  user: sessionUserData
}
