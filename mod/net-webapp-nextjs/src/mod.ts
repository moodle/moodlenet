import { v1_0 as net_v1_0 } from '@moodle/mod-net'
import { v1_0 as org_v1_0 } from '@moodle/mod-org'

import { mod } from '@moodle/domain'
import { v1_0 } from './'

declare module '@moodle/domain' {
  export interface MoodleMods {
    netWebappNextjs: moodle_net_webapp_nextjs_mod
  }
}

export type moodle_net_webapp_nextjs_mod = mod<{
  v1_0: {
    pri: {
      session: {
        logout(): Promise<void>
      }
      configs: {
        read(): Promise<{ nextjs: v1_0.Configs; net: net_v1_0.Configs; org: org_v1_0.Configs }>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{
          nextjs: v1_0.Configs
          net: net_v1_0.Configs
          org: org_v1_0.Configs
        }>
      }
    }
    evt: never
  }
}>
