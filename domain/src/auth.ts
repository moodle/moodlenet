import { d_u } from '@moodle/t-utils'

export type user = d_u<Users>

export interface Users {
  guest: unknown
  authenticated: AuthenticatedUser
}

export interface AuthenticatedUser {
  // id: string in some entity wrapper ?
  displayName: string
  // homePage: string
  // homePages: Record<appname, string> ?
  avatarUrl: null | string
}
