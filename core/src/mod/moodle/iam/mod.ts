import { mod } from '../../../types'
import * as v0_1 from './types/0_1'

export type module = mod<{
  V0_1: {
    pri: {
      userSession: {
        current(): Promise<v0_1.UserSession>
      }
    }
    sec: {
      userSession: {
        validate(_: {
          authToken: string | null | undefined
          primary: { name: string; version: string }
        }): Promise<v0_1.UserSession>
      }
    }
  }
}>
