import { mod } from '../../../types'
import { Configs_0_1 } from './types/configs/0_1'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        configs(): Promise<Configs_0_1>
      }
    }
    sec: {
      read: {
        configs(): Promise<Configs_0_1>
      }
    }
    evt: never
  }
}>
