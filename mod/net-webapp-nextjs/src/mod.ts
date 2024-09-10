import { v0_1 as v0_1_net } from '@moodle/mod-net'
import { v0_1 as v0_1_org } from '@moodle/mod-org'

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
        read(): Promise<{ app: v0_1.Configs; net: v0_1_net.Configs; org: v0_1_org.Configs }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{ app: v0_1.Configs; net: v0_1_net.Configs; org: v0_1_org.Configs }>
      }
    }
    evt: never
  }
}>
