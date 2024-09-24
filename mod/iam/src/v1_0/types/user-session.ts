import type { d_u } from '@moodle/lib-types'
import { userRecord } from './user'

export type user_session = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export type sessionUserData = Pick<userRecord, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedSession {
  user: sessionUserData
}
