import { eduPrimaryEnabledCategoriesSchemaConfigs, eduPrimaryMsgSchemaConfigs } from './types'

export * from './types'

export default interface EduDomain {
  event: { edu: unknown }
  service: { edu: unknown }
  primary: {
    edu: {
      session: {
        moduleInfo(): Promise<{
          schemaConfigs: eduPrimaryMsgSchemaConfigs
          enabledCategoriesSchemaConfigs: eduPrimaryEnabledCategoriesSchemaConfigs
        }>
      }
    }
  }
  secondary: {
    edu: {
      query: {
        moduleInfo(): Promise<{
          schemaConfigs: eduPrimaryMsgSchemaConfigs
          enabledCategoriesSchemaConfigs: eduPrimaryEnabledCategoriesSchemaConfigs
        }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
