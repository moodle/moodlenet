import type { mod } from '@moodle/lib-ddd'
import type { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
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
      system: {
        configs(): Promise<{
          configs: v1_0.Configs
        }>
      }
      admin: {
        updatePartialOrgInfo(_: { partialInfo: deep_partial<v1_0.OrgInfo> }): Promise<ok_ko<void>>
      }
    }
    sec: {
      db: {
        getConfigs(): Promise<{
          configs: v1_0.Configs
        }>
        updatePartialConfigs(_: {
          partialConfigs: deep_partial<v1_0.Configs>
        }): Promise<ok_ko<void>>
      }
    }
    evt: never
  }
}
export type moodle_org_mod = mod<pretty<MoodleOrgMod>>
