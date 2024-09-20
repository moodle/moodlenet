import type * as net_v1_0 from '@moodle/mod-net/v1_0/lib'
import type * as org_v1_0 from '@moodle/mod-org/v1_0/lib'

import { mod } from '@moodle/lib-ddd'
import * as v1_0 from './v1_0/types'

declare module '@moodle/lib-ddd' {
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
