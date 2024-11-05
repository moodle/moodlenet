import { eduPrimaryMsgSchemaConfigs } from './types'

export * from './types'

export default interface EduDomain {
  event: { edu: unknown }
  service: { edu: unknown }
  primary: {
    edu: {
      session: {
        moduleInfo(): Promise<{ schemaConfigs: eduPrimaryMsgSchemaConfigs }>
      }
    }
  }
  secondary: {
    edu: {
      query: {
        moduleInfo(): Promise<{ schemaConfigs: eduPrimaryMsgSchemaConfigs }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
