import { mod } from '@moodle/domain'
import { v0_1 } from './'
import { _t } from '@moodle/lib-types'

declare module '@moodle/domain' {
  export interface MoodleMods {
    net: moodle_net_mod
  }
}

interface MoodleNetMod {
  v0_1: {
    pri: {
      configs: {
        read(): Promise<{
          configs: v0_1.Configs
        }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{
          configs: v0_1.Configs
        }>
      }
    }
    evt: never
  }
}
export type moodle_net_mod = mod<_t<MoodleNetMod>>
