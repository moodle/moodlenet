import type { mod } from '@moodle/lib-ddd'
import type { _t } from '@moodle/lib-types'
import * as v1_0 from './v1_0/types'

export * as v1_0 from './v1_0/types'

declare module '@moodle/lib-ddd' {
  export interface MoodleMods {
    org: moodle_org_mod
  }
}

interface MoodleOrgMod {
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
export type moodle_org_mod = mod<_t<MoodleOrgMod>>
