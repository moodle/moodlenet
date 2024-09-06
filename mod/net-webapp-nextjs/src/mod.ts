import { v0_1 as v0_1_net } from '@moodle/mod-net'

import { mod } from '@moodle/domain'
import { v0_1 } from './'

declare module '@moodle/domain' {
  export interface MoodleMods {
    netWebappNextjs: moodle_net_webapp_nextjs_mod
  }
}

export type moodle_net_webapp_nextjs_mod = mod<{
  v0_1: {
    pri: {
      configs: {
        read(): Promise<{ configs: v0_1.Configs & { net: v0_1_net.Configs } }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{ configs: v0_1.Configs & { net: v0_1_net.Configs } }>
      }
    }
    evt: never
  }
}>
