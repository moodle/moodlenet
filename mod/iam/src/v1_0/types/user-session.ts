import type { session_token } from '@moodle/lib-ddd'
import type { d_u, date_time_string } from '@moodle/lib-types'
import { userRecord } from './user'

export type user_session = d_u<UserSessionTypes, 'type'>
export type session_obj = {
  token: session_token
  expires: date_time_string
}

interface UserSessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export type sessionUserData = Pick<userRecord, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedSession {
  user: sessionUserData
}

