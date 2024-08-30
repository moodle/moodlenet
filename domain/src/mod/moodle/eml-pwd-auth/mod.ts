import { mod, reply } from '../../../types'
import { Configs } from './types'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        configs(): reply<{ _200: { configs: Configs } }>
      }
    }
    prm: {
      eml: number
    }
  }
}>
