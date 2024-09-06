import { mod } from '@moodle/domain'
import { v0_1 } from './'

declare module '@moodle/domain' {
  export interface MoodleMods {
    net: moodle_net_mod
  }
}

export type moodle_net_mod = mod<{
  v0_1: {
    pri: {
      configs: {
        read(): Promise<{ configs: v0_1.Configs }>
      }
    }
    sec: {
      db_read: {
        configs(): Promise<{ configs: v0_1.Configs }>
      }
    }
    evt: never
  }
}>
