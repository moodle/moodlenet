import { mod } from '../../../types'
import { Permissions, user } from './types/auth'

export type module = mod<{
  V0_1: {
    pri: {
      currentSession: {
        auth(): Promise<{ user: user; permissions: Permissions }>
      }
    }
    sec: {
      secCh: {
        secEp(_: { se: string }): Promise<{ user: user; permissions: Permissions }>
      }
    }
    evt: {
      evtCh: {
        evEp(_: { ev: string }): never
      }
    }
    prm: { a: { x: string } }
  }
}>
