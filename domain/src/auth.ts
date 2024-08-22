import { d_u } from '@moodle/types'

export type user = d_u<Users>

export interface Users {
  guest: unknown
  authenticated: AuthenticatedUser
}

export interface AuthenticatedUser {
  displayName: string
  homePage: string
  avatarUrl: null | string
}
