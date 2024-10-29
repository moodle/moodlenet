import type { d_u } from '@moodle/lib-types'
import { userAccountRecord } from './user-account-record'
import { userProfileRecord } from '../../user-profile'

export type userSession = d_u<UserSessionTypes, 'type'>

interface UserSessionTypes {
  guest: GuestUserSession
  authenticated: AuthenticatedUserSession
}

export type GuestUserSession = unknown

export interface AuthenticatedUserSession {
  user: userSessionData
  profile: profileSessionData
}
export type userSessionData = Pick<userAccountRecord, 'id' | 'roles' | 'contacts'>
export type profileSessionData = Pick<userProfileRecord, 'id'>

export type userSessionInfo = {
  authenticated:
    | false
    | (AuthenticatedUserSession & {
        isAdmin: boolean
      })
}
