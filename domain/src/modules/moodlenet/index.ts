import { deep_partial_props, found_access_obj, ok_ko } from '@moodle/lib-types'
import { currentMoodlenetSessionData, moodlenetInfo, moodlenetPrimaryMsgSchemaConfigs, pointSystem } from './types'
import {
  moodlenetContributorAccessObject,
  moodlenetContributorId,
  moodlenetContributorMinimalInfo,
  moodlenetContributorRecord,
} from './types/moodlenet-contributor'
export * from './types'

export default interface MoodlenetDomain {
  event: { moodlenet: unknown }
  service: { moodlenet: unknown }
  primary: {
    moodlenet: {
      session: {
        moduleInfo(): Promise<{
          info: moodlenetInfo
          schemaConfigs: moodlenetPrimaryMsgSchemaConfigs
          pointSystem: pointSystem
        }>
        getMySessionUserRecords(): Promise<currentMoodlenetSessionData>
      }
      contributor: {
        getLeaders({ amount }: { amount?: number }): Promise<{ leaderContributors: moodlenetContributorMinimalInfo[] }>
        getById({
          moodlenetContributorId,
        }: {
          moodlenetContributorId: moodlenetContributorId
        }): Promise<found_access_obj<moodlenetContributorAccessObject>>
      }
      admin: {
        updatePartialMoodlenetInfo({ partialInfo }: { partialInfo: deep_partial_props<moodlenetInfo> }): Promise<ok_ko<void>>
      }
    }
  }
  secondary: {
    moodlenet: {
      write: {
        createMoodlenetContributor(moodlenetContributorRecord: moodlenetContributorRecord): Promise<void>
      }
      query: {
        contributors({
          range,
          sort,
          //filters
        }: {
          range: [limit: number, skip?: number]
          sort?: [by: 'points', dir?: 'ASC' | 'DESC']
          //filters?: queryContributorFilter[]
        }): Promise<{ moodlenetContributorRecords: moodlenetContributorRecord[] }>
        contributorById({
          id,
        }: {
          id: moodlenetContributorId
        }): Promise<ok_ko<{ moodlenetContributorRecord: moodlenetContributorRecord }, { notFound: unknown }>>
      }
      service?: unknown
      sync?: unknown
    }
  }
}
//type queryContributorFilter = d_u<{ access: { levels: moodlenetContributorAccess['level'][] } }, 'type'>
