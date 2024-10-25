import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { moodlenetInfo, MoodlenetPrimaryMsgSchemaConfigs, publishedCategories, suggestedContent } from './types'
import { contributorInfo } from './types/contributor'
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
      contributor: {
        getLeaders({ amount }: { amount?: number }): Promise<{ leaderContributors: contributorInfo[] }>
      }
      admin: {
        updatePartialMoodlenetInfo({ partialInfo }: { partialInfo: deep_partial_props<moodlenetInfo> }): Promise<ok_ko<void>>
      }
      content: {
        getSuggestedContent(): Promise<{ suggestions: unknown /* suggestedContent[] */ }>
      }
    }
  }
  secondary: {
    moodlenet: {
      query: {
        contributors({
          limit,
          skip,
          sort,
        }: {
          limit?: number
          skip?: number
          sort?: [by: 'points', dir?: 'ASC' | 'DESC']
        }): Promise<{ contributors: contributorInfo[] }>
      }
      service: unknown
      queue: unknown
      write: unknown
      sync: unknown
    }
  }
}
