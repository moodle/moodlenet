import { mod } from '@moodle/domain'
import * as v1_0 from './v1_0/types'
import { _t } from '@moodle/lib-types'


declare module '@moodle/domain' {
  export interface MoodleMods {
    net: moodle_net_mod
  }
}

interface MoodleNetMod {
  v1_0: {
    pri: {
      configs: {
        read(): Promise<{
          configs: v1_0.Configs
        }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{
          configs: v1_0.Configs
        }>
      }
    }
    evt: never
  }
}
export type moodle_net_mod = mod<_t<MoodleNetMod>>
