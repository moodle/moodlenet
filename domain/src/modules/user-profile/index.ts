import type { d_u, d_u__d, date_time_string, ok_ko } from '@moodle/lib-types'
import {
  createNewEduResourceDraftSchemaForm,
  eduCollectionApplyImageForm,
  eduCollectionData,
  eduCollectionMeta,
  eduCollectionMetaForm,
  eduResourceApplyImageForm,
  eduResourceData,
  eduResourceMeta,
  eduResourceMetaForm,
} from '../edu'
import { eduResourceIngestionStatus } from '../resource-ingestion'
import { adoptAssetForm, adoptAssetResponse } from '../storage'
import { userAccountId, userAccountRecord } from '../user-account'
import {
  UserProfilePrimaryMsgSchemaConfigs,
  draftId,
  eduCollectionDraft,
  eduCollectionDraftId,
  eduResourceDraft,
  eduResourceDraftId,
  profileImageType,
  profileInfo,
  profileInfoMeta,
  useProfileImageForm,
  userAccountExcerpt,
  userProfileId,
  userProfileRecord,
} from './types'
export * from './types'

export type userProfileIdSelect = d_u<
  { userProfileId: { userProfileId: userProfileId }; userAccountId: { userAccountId: userAccountId } },
  'by'
>

export default interface UserProfileDomain {
  event: { userProfile: unknown }
  service: {
    userProfile: {
      // draftResourceIngestionOutcome(_: {
      //   userProfileIdSelect: userProfileIdSelect
      //   eduResourceDraftId: eduResourceDraftId
      //   ingestionOutcome: ingestionOutcome
      // }): Promise<void>
    }
  }
  primary: {
    userProfile: {
      session: {
        moduleInfo(): Promise<{
          schemaConfigs: UserProfilePrimaryMsgSchemaConfigs
        }>
      }
      authenticated: {
        useTempImageAsProfileImage(_: {
          useProfileImageForm: useProfileImageForm
        }): Promise<{ adoptAssetResponse: adoptAssetResponse; userProfileId: userProfileId }>
        editProfileInfoMeta(_: { profileInfoMeta: profileInfoMeta }): Promise<
          ok_ko<
            { userProfileId: userProfileId },
            {
              notFound: unknown
              unknown: unknown
            }
          >
        >
        getMyUserRecords(): Promise<{
          userProfileRecord: Omit<userProfileRecord, 'userAccount'>
          userAccountRecord: Omit<userAccountRecord, 'displayName'>
        }>

        // draft collection
        createEduCollectionDraft(_: {
          eduCollectionMetaForm: eduCollectionMetaForm
        }): Promise<ok_ko<{ eduCollectionDraftId: eduCollectionDraftId }>>
        editEduCollectionDraft(_: {
          eduCollectionDraftId: eduCollectionDraftId
          eduCollectionMetaForm: eduCollectionMetaForm
        }): Promise<ok_ko<void>>
        applyEduCollectionDraftImage(_: {
          eduCollectionDraftId: eduCollectionDraftId
          applyImageForm: eduCollectionApplyImageForm
        }): Promise<{ adoptAssetResponse: adoptAssetResponse; userProfileId: userProfileId }>
        getEduCollectionDraft(_: {
          eduCollectionDraftId: eduCollectionDraftId
        }): Promise<ok_ko<eduCollectionDraft, { notFound: unknown }>>
        //

        // draft resource
        createEduResourceDraft(
          _: createNewEduResourceDraftSchemaForm,
        ): Promise<ok_ko<{ eduResourceDraftId: eduResourceDraftId }>>
        editEduResourceDraft(_: {
          eduResourceDraftId: eduResourceDraftId
          eduResourceMetaForm: eduResourceMetaForm
        }): Promise<ok_ko<void>>
        applyEduResourceDraftImage(_: {
          eduResourceDraftId: eduResourceDraftId
          applyImageForm: eduResourceApplyImageForm
        }): Promise<{ adoptAssetResponse: adoptAssetResponse; userProfileId: userProfileId }>
        getEduResourceDraft(_: {
          eduResourceDraftId: eduResourceDraftId
        }): Promise<ok_ko<eduResourceDraft, { notFound: unknown }>>
        //
      }
      admin: {
        byId(_: userProfileIdSelect): Promise<
          ok_ko<
            {
              userProfileRecord: userProfileRecord
            },
            {
              notFound: unknown
            }
          >
        >
      }
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
        setResourceIngestionStatus(_: {
          userProfileIdSelect: userProfileIdSelect
          eduResourceDraftId: eduResourceDraftId
          resourceIngestionStatus: eduResourceIngestionStatus
        }): Promise<void>
        useTempFileAsResourceDraftAsset(_: {
          resourceDraftId: eduResourceDraftId
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile'>
        }): Promise<d_u__d<adoptAssetResponse<'stored'>, 'status', 'done' | 'error'>>
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
        updateDraftResourceIngestionStatus(_: {
          eduResourceDraftId: eduResourceDraftId
          userProfileIdSelect: userProfileIdSelect
          resourceIngestionStatus: eduResourceIngestionStatus
        }): Promise<ok_ko<void>>
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
          image: profileInfo['avatar']
          type: profileImageType
        }): Promise<ok_ko<void>>
        updateProfileInfoMeta(_: {
          lastEditDate: date_time_string
          userProfileIdSelect: userProfileIdSelect
          profileInfoMeta: profileInfoMeta
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: {
          type: profileImageType
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile' | 'none'>
        }): Promise<d_u__d<adoptAssetResponse<'stored' | 'none'>, 'status', 'done' | 'error'>>
        useTempImageInDraft(_: {
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'tempFile' | 'none'>
          draftId: draftId
          draftType: 'eduResource' | 'eduCollection'
        }): Promise<d_u__d<adoptAssetResponse<'stored' | 'none'>, 'status', 'done' | 'error'>>
        /*  updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>> */
      }
    }
  }
}
