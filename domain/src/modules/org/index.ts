import { deep_partial, ok_ko } from '@moodle/lib-types'
import { OrgInfo, OrgPrimaryMsgSchemaConfigs } from './types'

export * from './types'

export default interface OrgDomain {
  event: { org: unknown }
  primary: {
    org: {
      session: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: OrgPrimaryMsgSchemaConfigs }>
      }
      admin: {
        updatePartialOrgInfo(_: { partialInfo: deep_partial<OrgInfo> }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    org: {
      queue: unknown
      query: {
        moduleInfo(): Promise<{ info: OrgInfo; schemaConfigs: OrgPrimaryMsgSchemaConfigs }>
      }
      service: unknown
      write: unknown
      sync: unknown
    }
  }
}
