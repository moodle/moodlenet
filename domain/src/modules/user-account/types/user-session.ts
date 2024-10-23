import type { d_u } from '@moodle/lib-types'
import { userAccountRecord } from './user-account-record'

export type userSession = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestUserSession
  authenticated: AuthenticatedUserSession
}

export type GuestUserSession = unknown

export type userSessionData = Pick<userAccountRecord, 'id' | 'roles' | 'displayName' | 'contacts'>

export interface AuthenticatedUserSession {
  user: userSessionData
}
