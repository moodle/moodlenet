import type { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { Configs, OrgInfo } from './types'
export * from './types'

export type org_primary=pretty<OrgPrimary>
export type org_secondary=pretty<OrgSecondary>

export interface OrgPrimary {
  system: {
    configs(): Promise<{
      configs: Configs
    }>
  }
  admin: {
    updatePartialOrgInfo(_: { partialInfo: deep_partial<OrgInfo> }): Promise<ok_ko<void>>
  }
}
export interface OrgSecondary {
  db: {
    getConfigs(): Promise<{
      configs: Configs
    }>
    updatePartialConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<void>>
  }
}
