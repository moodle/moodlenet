import type { d_u, d_u__d, date_time_string, ok_ko } from '@moodle/lib-types'
import {
  UserPrimaryMsgSchemaConfigs,
  assetProcessStatus,
  draftId,
  eduCollectionDraft,
  eduResourceDraft,
  processStatus,
  profileImageType,
  profileInfo,
  profileInfoImages,
  userAccountExcerpt,
  userProfileId,
  userProfileRecord,
} from '../../model/user-home/types'
import { eduCollectionData, eduCollectionMeta, eduResourceData, eduResourceMeta } from '../edu'
import { eduResourceIngestionOutcome } from '../resource-ingestion'
import { eduResourceAiGenerationOutcome } from '../resource-metadata-generation'
import { adoptAssetForm, adoptAssetResult } from '../storage'
import { userAccountId } from '../user-account'
export * from '../../model/user-home/types'

export type userProfileIdSelect = d_u<
  { userProfileId: { userProfileId: userProfileId }; userAccountId: { userAccountId: userAccountId } },
  'by'
>

export default interface UserProfileDomain {
  event: { userProfile: unknown }
  service: { userProfile: unknown }
  primary: {
    userProfile: {
      session: {
        moduleInfo(): Promise<{
          schemaConfigs: UserPrimaryMsgSchemaConfigs
        }>
      }
      authenticated: {
        //
      }
      // admin: {
      //   // FIXME: possibly move to moodlenet, using contributorIdSelect ?
      //   byId(_: userProfileIdSelect): Promise<
      //     ok_ko<
      //       {
      //         userProfileRecord: userProfileRecord
      //       },
      //       {
      //         notFound: unknown
      //       }
      //     >
      //   >
      // }
    }
  }
  secondary: {
    userProfile: {
      service: unknown
      sync: {
        userAccountExcerpt(_: { userAccountExcerpt: userAccountExcerpt }): Promise<ok_ko<void>>
      }
      query: {
        getUserProfile(
          userProfileIdSelect: userProfileIdSelect,
        ): Promise<ok_ko<{ userProfileRecord: userProfileRecord }, { notFound: unknown }>>
        getDraft<draftType extends 'eduResource' | 'eduCollection'>(_: {
          userProfileIdSelect: userProfileIdSelect
          draftType: draftType
          draftId: string
        }): Promise<
          ok_ko<
            draftType extends 'eduResource'
              ? eduResourceDraft
              : draftType extends 'eduCollection'
                ? eduCollectionDraft
                : never,
            { notFound: unknown }
          >
        >
      }
      write: {
        useTempFileAsNewResourceDraftAsset(_: {
          eduResourceDraftId: string
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile'>
        }): Promise<d_u__d<adoptAssetResult<'stored'>, 'status', 'done' | 'error'>>
        createDraft(_: {
          userProfileIdSelect: userProfileIdSelect
          draft: d_u<
            {
              eduResource: { data: eduResourceDraft }
              eduCollection: { data: eduCollectionDraft }
            },
            'type'
          >
        }): Promise<ok_ko<void>>
        updateDraftResourceAssetProcessStatus(
          _: {
            eduResourceDraftId: string
            userProfileIdSelect: userProfileIdSelect
          } & d_u<
            {
              ingestion: {
                processStatus: processStatus<eduResourceIngestionOutcome>
                condition: {
                  status: assetProcessStatus['ingestion']['status']
                }
              }
              aiGeneration: {
                processStatus: processStatus<eduResourceAiGenerationOutcome>
                condition: {
                  status: assetProcessStatus['aiGeneration']['status']
                }
              }
            },
            'processType'
          >,
        ): Promise<ok_ko<void>>
        updateDraftMeta(_: {
          userProfileIdSelect: userProfileIdSelect
          draftId: draftId
          meta: d_u<{ eduResource: { data: eduResourceMeta }; eduCollection: { data: eduCollectionMeta } }, 'type'>
          lastEditDate: date_time_string
        }): Promise<ok_ko<void>>
        updateDraftImage<draftType extends 'eduResource' | 'eduCollection'>(_: {
          draftType: draftType
          userProfileIdSelect: userProfileIdSelect
          lastEditDate: date_time_string
          draftId: draftId
          image: eduCollectionData['image'] & eduResourceData['image']
        }): Promise<ok_ko<void>>
        createUserProfile(_: { userProfileRecord: userProfileRecord }): Promise<ok_ko<void>>
        updateProfileImage(_: {
          userProfileIdSelect: userProfileIdSelect
          lastEditDate: date_time_string
          image: profileInfoImages['avatar']
          type: profileImageType
        }): Promise<ok_ko<void>>
        updateProfileInfoMeta(_: {
          lastEditDate: date_time_string
          userProfileIdSelect: userProfileIdSelect
          profileInfoMeta: profileInfo
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: {
          type: profileImageType
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile' | 'none'>
        }): Promise<d_u__d<adoptAssetResult<'stored' | 'none'>, 'status', 'done' | 'error'>>
        useTempImageInDraft(_: {
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile' | 'none'>
          draftId: draftId
          draftType: 'eduResource' | 'eduCollection'
        }): Promise<d_u__d<adoptAssetResult<'stored' | 'none'>, 'status', 'done' | 'error'>>
        /*  updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>> */
      }
    }
  }
}
