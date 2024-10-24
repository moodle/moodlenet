import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { moodlenetInfo, MoodlenetPrimaryMsgSchemaConfigs, publishedCategories } from './types'
import { pointSystem } from './types/point-system'
export * from './types'

export default interface MoodlenetDomain {
  event: { moodlenet: unknown }
  primary: {
    moodlenet: {
      session: {
        moduleInfo(): Promise<{
          info: moodlenetInfo
          schemaConfigs: MoodlenetPrimaryMsgSchemaConfigs
          pointSystem: pointSystem
          publishedCategories: publishedCategories
        }>
      }
      admin: {
        updatePartialMoodlenetInfo(_: { partialInfo: deep_partial_props<moodlenetInfo> }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    moodlenet: {
      queue: unknown
      service: unknown
      query: unknown
      write: unknown
      sync: unknown
    }
  }
}
