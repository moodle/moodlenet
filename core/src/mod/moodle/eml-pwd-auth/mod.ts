import { mod } from '../../../types'
import { Configs_0_1 } from './types/0_1'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        configs(): Promise<{ configs: Configs_0_1 }>
      }
    }
    sec: {
      read: {
        configs(): Promise<{ configs: Configs_0_1 }>
      }
    }
    prm: { a: { b: number } }
  }
}>
