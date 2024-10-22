import type { d_u, deep_partial, ok_ko } from '@moodle/lib-types'
import { userId } from '../iam'
import { useTempFileResult } from '../storage'
import {
  profileImage,
  profileInfo,
  iamUserExcerpt,
  user_profile_access_object,
  userProfileId,
  userProfileRecord,
  UserProfilePrimaryMsgSchemaConfigs,
  useProfileImageForm,
} from './types'
export * from './types'

export type by_user_id_or_user_profile_id = d_u<
  { userProfile: { userProfileId: userProfileId }; user: { userId: userId } },
  'idOf'
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
          profileInfo: deep_partial<profileInfo>
        }): Promise<ok_ko<void, { notFound: unknown; unknown: unknown }>>
      }
      userProfile: {
        access(_: {
          by: by_user_id_or_user_profile_id
        }): Promise<ok_ko<{ accessObject: user_profile_access_object }, { notFound: unknown }>>
      }
    }
  }
  secondary: {
    userProfile: {
      queue: {
        createUserProfile(_: { userProfile: userProfileRecord }): Promise<ok_ko<void>>
      }
      service: unknown
      sync: {
        iamUserExcerpt(_: { iamUserExcerpt: iamUserExcerpt }): Promise<ok_ko<void>>
      }
      query: {
        getUserProfile(_: {
          by: by_user_id_or_user_profile_id
        }): Promise<ok_ko<{ userProfile: userProfileRecord }, { notFound: unknown }>>
      }
      write: {
        updatePartialProfileInfo(_: {
          userProfileId: userProfileId
          partialProfileInfo: deep_partial<profileInfo>
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: { as: profileImage; id: userProfileId; tempId: string }): Promise<useTempFileResult>
        updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: Partial<userProfileRecord>
        }): Promise<ok_ko<void>>
      }
    }
  }
}
