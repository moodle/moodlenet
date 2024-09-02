import { d_u } from '@moodle/lib/types'
import { concrete } from 'domain/src/types'

export type user = d_u<UsersMap, 'type'>

interface UsersMap {
  guest: unknown
  authenticated: AuthenticatedUser
}

export interface AuthenticatedUser {
  id: string
}

declare const _: unique symbol
export type permissions = concrete<'prm'>
