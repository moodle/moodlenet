import { mod } from '../../../types'
import { Permissions, user } from './types/auth'

export type module = mod<{
  V0_1: {
    pri: {
      currentSession: {
        auth(): Promise<{ user: user; permissions: Permissions }>
      }
    }
    prm: {
      iam: number
    }
  }
}>
