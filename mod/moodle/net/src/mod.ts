import { mod } from '@moodle/domain'
import { Configs } from './0_1/types'

declare module '@moodle/domain' {
  export interface MoodleMods {
    net: moodle_net_mod
  }
}

export type moodle_net_mod = mod<{
  V0_1: {
    pri: {
      read: {
        configs(): Promise<Configs>
      }
    }
    sec: {
      read: {
        configs(): Promise<Configs>
      }
    }
    evt: never
  }
}>
