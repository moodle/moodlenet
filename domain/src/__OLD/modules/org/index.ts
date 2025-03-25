import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { OrgInfo, orgPrimaryMsgSchemaConfigs } from './types'

export * from './types'

export default interface OrgDomain {
  event: { org: unknown }
  service: { org: unknown }
  primary: {
    org: {
      session: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: orgPrimaryMsgSchemaConfigs }>
      }
      admin: {
        updatePartialOrgInfo(_: { partialInfo: deep_partial_props<OrgInfo> }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    org: {
      query: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: orgPrimaryMsgSchemaConfigs }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
