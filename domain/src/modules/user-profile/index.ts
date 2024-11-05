import type { _nullish, d_u, deep_partial_props, ok_ko } from '@moodle/lib-types'
import { eduCollectionApplyImageForm, eduCollectionMetaForm } from '../edu'
import { deleteFileResult, useTempFileResult } from '../storage'
import { userAccountId, userAccountRecord } from '../user-account'
import {
  UserProfilePrimaryMsgSchemaConfigs,
  eduCollectionDraft,
  eduCollectionDraftId,
  eduResourceDraftId,
  profileImage,
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
        useTempImageAsProfileImage(
          _: useProfileImageForm,
        ): Promise<[use_or_delete_result: useTempFileResult | deleteFileResult, { userProfileId: userProfileId }]>
        editProfileInfoMeta(_: { partialProfileInfoMeta: deep_partial_props<profileInfoMeta> }): Promise<
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
        createEduCollectionDraft(_: {
          eduCollectionMetaForm: eduCollectionMetaForm
        }): Promise<ok_ko<{ eduCollectionDraftId: eduCollectionDraftId }>>
        editEduCollectionDraft(_: {
          eduCollectionDraftId: eduCollectionDraftId
          eduCollectionMetaForm: eduCollectionMetaForm
        }): Promise<ok_ko<void>>
        applyEduCollectionDraftImage(
          _: {
            eduCollectionDraftId: eduCollectionDraftId
          } & eduCollectionApplyImageForm,
        ): Promise<[use_or_delete_result: useTempFileResult | deleteFileResult, { userProfileId: userProfileId }]>
        getEduCollectionDraft(_: {
          eduCollectionDraftId: eduCollectionDraftId
        }): Promise<ok_ko<eduCollectionDraft, { notFound: unknown }>>
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
          _: userProfileIdSelect,
        ): Promise<ok_ko<{ userProfileRecord: userProfileRecord }, { notFound: unknown }>>
        getEduCollectionDraft(_: {
          userProfileId: userProfileId
          eduCollectionDraftId: eduCollectionDraftId
        }): Promise<ok_ko<eduCollectionDraft, { notFound: unknown }>>
      }
      write: {
        createEduCollectionDraft(_: {
          userProfileId: userProfileId
          eduCollectionDraft: eduCollectionDraft
          eduCollectionDraftId: eduCollectionDraftId
        }): Promise<ok_ko<void>>
        updateEduCollectionDraft(_: {
          userProfileId: userProfileId
          eduCollectionDraftId: eduCollectionDraftId
          partialEduCollectionDraft: deep_partial_props<eduCollectionDraft>
        }): Promise<ok_ko<void>>
        createUserProfile(_: { userProfileRecord: userProfileRecord }): Promise<ok_ko<void>>
        updatePartialProfileInfo(_: {
          userProfileId: userProfileId
          partialProfileInfo: deep_partial_props<profileInfo>
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: {
          as: profileImage
          userProfileId: userProfileId
          tempId: string | _nullish
        }): Promise<useTempFileResult | deleteFileResult>
        useTempImageInDraft(_: {
          type: 'eduCollection' | 'eduResource'
          draftId: eduResourceDraftId | eduCollectionDraftId
          userProfileId: userProfileId
          tempId: string | _nullish
        }): Promise<useTempFileResult | deleteFileResult>
        /*  updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>> */
      }
    }
  }
}
