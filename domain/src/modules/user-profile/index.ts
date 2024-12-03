import type { d_u, d_u__d, date_time_string, ok_ko } from '@moodle/lib-types'
import { adoptAssetForm, adoptAssetResponse } from '../storage'
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
  service: { userProfile: unknown }
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
      service?: unknown
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
        useTempFileAsResourceDraftAsset(_: {
          resourceDraftId: eduResourceDraftId
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'upload'>
        }): Promise<d_u__d<adoptAssetResponse<'local'>, 'status', 'done' | 'error'>>
        createDraft<draftType extends 'eduResource' | 'eduCollection'>(_: {
          userProfileIdSelect: userProfileIdSelect
          draftType: draftType
          draft: draftType extends 'eduResource'
            ? eduResourceDraft
            : draftType extends 'eduCollection'
              ? eduCollectionDraft
              : never
          draftId: draftId
        }): Promise<ok_ko<void>>
        updateDraftMeta<draftType extends 'eduResource' | 'eduCollection'>(_: {
          userProfileIdSelect: userProfileIdSelect
          draftType: draftType
          draftId: draftId
          meta: draftType extends 'eduResource'
            ? eduResourceMeta
            : draftType extends 'eduCollection'
              ? eduCollectionMeta
              : never
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
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'upload' | 'none'>
        }): Promise<d_u__d<adoptAssetResponse<'local' | 'none'>, 'status', 'done' | 'error'>>
        useTempImageInDraft<draftType extends 'eduResource' | 'eduCollection'>(_: {
          userProfileId: userProfileId
          adoptAssetForm: d_u__d<adoptAssetForm, 'type', 'upload' | 'none'>
          draftId: draftId
          draftType: draftType
        }): Promise<d_u__d<adoptAssetResponse<'local' | 'none'>, 'status', 'done' | 'error'>>
        /*  updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>> */
      }
    }
  }
}
