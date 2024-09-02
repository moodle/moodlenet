import { mod, PrimarySession } from '../../../types'
import { permissions, user } from './types/auth'

interface UserSession {
  user: user
  permissions: permissions
}

export type module = mod<{
  V0_1: {
    pri: {
      userSession: {
        current(): Promise<UserSession>
      }
    }
    sec: {
      userSession: {
        validate(_: { primarySession: PrimarySession }): Promise<UserSession>
      }
    }
  }
}>
