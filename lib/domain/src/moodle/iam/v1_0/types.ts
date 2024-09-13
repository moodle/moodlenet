import { session_token } from '@moodle/domain'
import { d_u, date_time_string, email_address } from '@moodle/lib-types'
import { z } from 'zod'
import type { getPrimarySchemas } from './primary-schemas'
export type user_id = string
export type user_role = 'admin' | 'publisher'

export type loginForm = z.infer<ReturnType<typeof getPrimarySchemas>['loginSchema']>

export type signupForm = z.infer<ReturnType<typeof getPrimarySchemas>['signupSchema']>

export interface UserData {
  id: user_id
  roles: user_role[]
  displayName: string
  contacts: {
    email: email_address
  }
}

export interface PrimaryMsgSchemaConfigs {
  user: {
    email: { max: number; min: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number }
  }
  myAccount: {
    selfDeletionRequestReason: { max: number; min: number }
  }
}

export type user_session = d_u<UserSessionTypes, 'type'>
export type session = {
  token: session_token
  expires: date_time_string
}

interface UserSessionTypes {
  guest: GuestSession
  authenticated: AuthenticatedSession
}

export type GuestSession = unknown

export interface AuthenticatedSession {
  user: UserData
}
