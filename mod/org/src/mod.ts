import { mod } from '@moodle/domain'
import { _t } from '@moodle/lib-types'
import { v0_1 } from './'

declare module '@moodle/domain' {
  export interface MoodleMods {
    org: moodle_org_mod
  }
}

interface MoodleOrgMod {
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
export type moodle_org_mod = mod<_t<MoodleOrgMod>>
