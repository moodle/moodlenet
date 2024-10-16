import type { d_u } from '@moodle/lib-types'
import { user_record } from './user'

export type userSession = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestUserSession
  authenticated: AuthenticatedUserSession
}

export type GuestUserSession = unknown

export type userSessionData = Pick<user_record, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedUserSession {
  user: userSessionData
}
