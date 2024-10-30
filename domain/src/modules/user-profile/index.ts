import type { d_u, deep_partial_props, ok_ko } from '@moodle/lib-types'
import { useTempFileResult } from '../storage'
import { userAccountId, userAccountRecord } from '../user-account'
import {
  UserProfilePrimaryMsgSchemaConfigs,
  profileImage,
  profileInfo,
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
export type userProfilePrimary = {
  session: {
    moduleInfo(): Promise<{
      schemaConfigs: UserProfilePrimaryMsgSchemaConfigs
    }>
  }
  authenticated: {
    useTempImageAsProfileImage(
      _: useProfileImageForm,
    ): Promise<[useTempFileResult: useTempFileResult, { userProfileId: userProfileId }]>
    editProfileInfo(_: { profileInfo: deep_partial_props<profileInfo> }): Promise<
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

export default interface UserProfileDomain {
  event: { userProfile: unknown }
  service: { userProfile: unknown }
  primary: {
    userProfile: userProfilePrimary
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
      }
      write: {
        createUserProfile(_: { userProfileRecord: userProfileRecord }): Promise<ok_ko<void>>
        updatePartialProfileInfo(_: {
          userProfileId: userProfileId
          partialProfileInfo: deep_partial_props<profileInfo>
        }): Promise<ok_ko<void>>
        useTempImageInProfile(_: {
          as: profileImage
          userProfileId: userProfileId
          tempId: string
        }): Promise<useTempFileResult>
        /*  updatePartialUserProfile(_: {
          userProfileId: userProfileId
          partialUserProfile: deep_partial_props<userProfileRecord>
        }): Promise<ok_ko<void>> */
      }
    }
  }
}
