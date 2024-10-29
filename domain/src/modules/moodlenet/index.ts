import { d_u, deep_partial_props, ok_ko } from '@moodle/lib-types'
import { userAccountId } from '../user-account'
import { userProfileId } from '../user-profile'
import {
  currentMoodlenetSessionData,
  moodlenetContributorId,
  moodlenetContributorRecord,
  moodlenetPrimaryMsgSchemaConfigs,
  moodlenetSiteInfo,
  pointSystem,
} from './types'
export * from './types'


export default interface MoodlenetDomain {
  event: { moodlenet: unknown }
  service: { moodlenet: unknown }
  primary: {
    moodlenet: {
      session: {
        moduleInfo(): Promise<{
          info: moodlenetSiteInfo
          schemaConfigs: moodlenetPrimaryMsgSchemaConfigs
          pointSystem: pointSystem
        }>
        getMySessionUserRecords(): Promise<currentMoodlenetSessionData>
      }
      admin: {
        updatePartialMoodlenetInfo({
          partialInfo,
        }: {
          partialInfo: deep_partial_props<moodlenetSiteInfo>
        }): Promise<ok_ko<void>>
        contributor(
          by: d_u<
            {
              userProfileId: { userProfileId: userProfileId }
              userAccountId: { userAccountId: userAccountId }
              moodlenetContributorId: { moodlenetContributorId: moodlenetContributorId }
            },
            'by'
          >,
        ): Promise<ok_ko<{ moodlenetContributorRecord: moodlenetContributorRecord }, { notFound: unknown }>>
      }
    }
  }
  secondary: {
    moodlenet: {
      write: {
        createMoodlenetContributor(_: { moodlenetContributorRecord: moodlenetContributorRecord }): Promise<void>
        updatePartialMoodlenetContributor(_: {
          select: moodlenetContributorIdSelect
          partialMoodlenetContributorRecord: deep_partial_props<moodlenetContributorRecord>
        }): Promise<void>
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
        contributor(
          by: moodlenetContributorIdSelect,
        ): Promise<ok_ko<{ moodlenetContributorRecord: moodlenetContributorRecord }, { notFound: unknown }>>
      }
      service?: unknown
      sync?: unknown
    }
  }
}
//type queryContributorFilter = d_u<{ access: { levels: moodlenetContributorAccess['level'][] } }, 'type'>

export type moodlenetContributorIdSelect = d_u<
  {
    userProfileId: {
      userProfileId: userProfileId
    }
    userAccountId: {
      userAccountId: userAccountId
    }
    moodlenetContributorId: {
      moodlenetContributorId: moodlenetContributorId
    }
  },
  'by'
>
