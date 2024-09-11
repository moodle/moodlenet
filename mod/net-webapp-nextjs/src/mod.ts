import { v0_1 as net_v0_1 } from '@moodle/mod-net'
import { v0_1 as org_v0_1 } from '@moodle/mod-org'

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
        read(): Promise<{ me: v0_1.Configs; net: net_v0_1.Configs; org: org_v0_1.Configs }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{ me: v0_1.Configs; net: net_v0_1.Configs; org: org_v0_1.Configs }>
      }
    }
    evt: never
  }
}>
