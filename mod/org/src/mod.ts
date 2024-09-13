import { mod } from '@moodle/domain'
import { _t } from '@moodle/lib-types'
import { v1_0 } from './'

declare module '@moodle/domain' {
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
