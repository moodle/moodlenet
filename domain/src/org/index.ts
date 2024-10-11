import type { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { Configs, OrgInfo, OrgPrimaryMsgSchemaConfigs } from './types'
export * from './types'

export type org_primary = pretty<OrgPrimary>
// export type org_secondary = pretty<OrgSecondary>

export interface OrgPrimary {
  session: {
    moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: OrgPrimaryMsgSchemaConfigs }>
  }
  admin: {
    updatePartialOrgInfo(_: { partialInfo: deep_partial<OrgInfo> }): Promise<ok_ko<void>>
  }
}
// export interface OrgSecondary {}
