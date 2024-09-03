import { d_u } from '@moodle/lib/types'
import { concrete } from '../../../../../types'

export type user = d_u<UsersMap, 'type'>

interface UsersMap {
  guest: unknown
  authenticated: AuthenticatedUser
}

export interface AuthenticatedUser {
  id: string
}

export interface UserSession {
  user: user
  permissions: permissions
}

declare const _: unique symbol
export type permissions = concrete<'prm'>
