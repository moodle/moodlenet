import { d_u, date_time_string, deep_partial_props, ok_ko } from '@moodle/lib-types'
import { maybeAsset } from '../storage'
import { userAccountId } from '../user-account'
import { profileImageType, profileInfoMeta, userProfileId, userProfileIdSelect } from '../user-profile'
import {
  contributorAccessLevel,
  currentMoodlenetSessionData,
  moodlenetContributorId,
  moodlenetContributorRecord,
  moodlenetEduPublishPrimaryMsgSchemaConfigOverrides,
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
          eduPublishPrimaryMsgSchemaConfigOverrides: moodlenetEduPublishPrimaryMsgSchemaConfigOverrides
        }>
        getMyCurrentMoodlenetSessionData(): Promise<currentMoodlenetSessionData>
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
        updateMoodlenetContributorProfileInfoMeta(_: {
          select: moodlenetContributorIdSelect
          profileInfoMeta: profileInfoMeta
          lastEditDate: date_time_string
        }): Promise<void>
        updateMoodlenetContributorProfileInfoImage(_: {
          select: moodlenetContributorIdSelect
          type: profileImageType
          image: maybeAsset
          lastEditDate: date_time_string
        }): Promise<void>
        updateMoodlenetContributorAccess(_: {
          select: moodlenetContributorIdSelect
          access: moodlenetContributorRecord['access']
        }): Promise<void>
      }
      query: {
        contributors({
          range,
          sort,
          // filters,
        }: {
          range: [limit: number, skip?: number]
          sort?: [by: 'points', dir?: 'ASC' | 'DESC']
          // filters: queryContributorFilter[]  /// REVIEW filtering in general for contributors
        }): Promise<{ moodlenetContributorRecords: moodlenetContributorRecord[] }>
        contributor(_: {
          select: moodlenetContributorIdSelect
          filter: {
            accessLevel: false | contributorAccessLevel[] /// REVIEW filtering in general for contributors
          }
        }): Promise<ok_ko<{ moodlenetContributorRecord: moodlenetContributorRecord }, { notFound: unknown }>>
      }
      service?: unknown
      sync?: unknown
    }
  }
}
export type queryContributorFilter = d_u<{ access: { accessLevel: contributorAccessLevel[] } }, 'type'>

export type moodlenetContributorIdSelect =
  | userProfileIdSelect
  | d_u<
      {
        moodlenetContributorId: {
          moodlenetContributorId: moodlenetContributorId
        }
      },
      'by'
    >
