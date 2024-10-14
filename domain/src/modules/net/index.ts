import { deep_partial, ok_ko } from '@moodle/lib-types'
import { MoodleNetInfo, MoodleNetPrimaryMsgSchemaConfigs } from './types'
export * from './types'

export default interface NetDomain {
  event: { net: unknown }
  primary: {
    net: {
      session: {
        moduleInfo(): Promise<{
          info: MoodleNetInfo
          schemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
        }>
      }
      admin: {
        updatePartialMoodleNetInfo(_: {
          partialInfo: deep_partial<MoodleNetInfo>
        }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    net: {
      queue: unknown
      service: unknown
      query: unknown
      write: unknown
      sync: unknown
    }
  }
}
