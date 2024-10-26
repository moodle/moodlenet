import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { OrgInfo, OrgPrimaryMsgSchemaConfigs } from './types'

export * from './types'

export default interface OrgDomain {
  event: { org: unknown }
  primary: {
    org: {
      service?: unknown
      session: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: OrgPrimaryMsgSchemaConfigs }>
      }
      admin: {
        updatePartialOrgInfo(_: { partialInfo: deep_partial_props<OrgInfo> }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    org: {
      query: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: OrgPrimaryMsgSchemaConfigs }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
