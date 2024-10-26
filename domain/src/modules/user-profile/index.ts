import type { d_u, deep_partial_props, ok_ko } from '@moodle/lib-types'
import { useTempFileResult } from '../storage'
import { userAccountId } from '../user-account'
import {
  UserProfilePrimaryMsgSchemaConfigs,
  profileImage,
  profileInfo,
  useProfileImageForm,
  userAccountExcerpt,
  userProfileAccessObject,
  userProfileId,
  userProfileRecord,
} from './types'
export * from './types'

export type get_user_profile_by = d_u<
  { userProfileId: { userProfileId: userProfileId }; userAccountId: { userAccountId: userAccountId } },
  'by'
>
export default interface UserProfileDomain {
  event: { userProfile: unknown }
  primary: {
    userProfile: {
      session: {
        moduleInfo(): Promise<{ schemaConfigs: UserProfilePrimaryMsgSchemaConfigs }>
      }
      editProfile: {
        useTempImageAsProfileImage(_: useProfileImageForm): Promise<useTempFileResult>
        editProfileInfo(_: {
          userProfileId: userProfileId
          profileInfo: deep_partial_props<profileInfo>
        }): Promise<ok_ko<void, { notFound: unknown; unknown: unknown }>>
      }
      access: {
        byId(_: get_user_profile_by): Promise<ok_ko<{ accessObject: userProfileAccessObject }, { notFound: unknown }>>
      }
      me: {
        getMyProfile(): Promise<ok_ko<{ userProfileRecord: userProfileRecord }, { unauthenticated: unknown }>>
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
          _: get_user_profile_by,
        ): Promise<ok_ko<{ userProfileRecord: userProfileRecord }, { notFound: unknown }>>
      }
      write: {
        createUserProfile(_: { userProfileRecord: userProfileRecord }): Promise<ok_ko<void>>
        updatePartialProfileInfo(_: {
          userProfileId: userProfileId
          partialProfileInfo: deep_partial_props<profileInfo>
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: { as: profileImage; id: userProfileId; tempId: string }): Promise<useTempFileResult>
        updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>>
      }
    }
  }
}
