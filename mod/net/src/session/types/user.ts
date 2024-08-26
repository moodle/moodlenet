import { SomeOf } from '../../../../lib/common/utils/types'

export type user = SomeOf<Users>

export interface AuthenticatedUser {
  displayName: string
  homePage: string
  avatarUrl: null | string
}

export interface Users {
  guest: unknown
  authenticated: AuthenticatedUser
}
