import { d_u } from '@moodle/lib/types'

export type user = d_u<UsersMap, 'type'>

interface UsersMap {
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

declare const _: unique symbol
export interface Permissions {
  [_]?: never
}
