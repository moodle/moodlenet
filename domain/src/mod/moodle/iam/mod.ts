import { mod, reply } from '../../../types'
import { Permissions, user } from './types/auth'

export type module = mod<{
  V0_1: {
    pri: {
      'current-session': {
        auth(): reply<{ _200: { user: user; permissions: Permissions } }>
      }
    }
    prm: {
      iam: number
    }
  }
}>
