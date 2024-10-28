import { deep_partial_props, ok_ko } from '@moodle/lib-types'
import { moodlenetInfo, MoodlenetPrimaryMsgSchemaConfigs } from './types'
import { accessMoodlenetContributor, moodlenetContributorId, moodlenetUserRecord } from './types/moodlenet-contributor'
import { pointSystem } from './types/point-system'
export * from './types'

export default interface MoodlenetDomain {
  event: { moodlenet: unknown }
  service: { moodlenet: unknown }
  primary: {
    moodlenet: {
      session: {
        moduleInfo(): Promise<{
          info: moodlenetInfo
          schemaConfigs: MoodlenetPrimaryMsgSchemaConfigs
          pointSystem: pointSystem
        }>
      }
      contributor: {
        getLeaders({ amount }: { amount?: number }): Promise<{ leaderContributors: accessMoodlenetContributor[] }>
        getById({
          moodlenetContributorId,
        }: {
          moodlenetContributorId: moodlenetContributorId
        }): Promise<ok_ko<{ accessMoodlenetContributor: accessMoodlenetContributor }, { notAccessible: unknown }>>
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
        }): Promise<{ moodlenetContributorRecord: moodlenetUserRecord[] }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
