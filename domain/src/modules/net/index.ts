import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { moodlenetInfo, MoodleNetPrimaryMsgSchemaConfigs } from './types'
export * from './types'

export default interface NetDomain {
  event: { net: unknown }
  primary: {
    net: {
      session: {
        moduleInfo(): Promise<{
          info: moodlenetInfo
          schemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
        }>
      }
      admin: {
        updatePartialMoodleNetInfo(_: { partialInfo: deep_partial_props<moodlenetInfo> }): Promise<ok_ko<void>>
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
