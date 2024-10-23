import type { d_u } from '@moodle/lib-types'
import { userRecord } from './user'

export type userSession = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestUserSession
  authenticated: AuthenticatedUserSession
}

export type GuestUserSession = unknown

export type userSessionData = Pick<userRecord, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedUserSession {
  user: userSessionData
}
