import type { d_u, deep_partial, ok_ko } from '@moodle/lib-types'
import { userId } from '../iam'
import { useTempFileResult } from '../storage'
import {
  profileImage,
  profileInfo,
  iamUserExcerpt,
  user_home_access_object,
  userHomeId,
  userHomeRecord,
  UserHomePrimaryMsgSchemaConfigs,
} from './types'
export * from './types'

export type by_user_id_or_user_home_id = d_u<{ userHome: { userHomeId: userHomeId }; user: { userId: userId } }, 'idOf'>
export default interface UserHomeDomain {
  event: { userHome: unknown }
  primary: {
    userHome: {
      session: {
        moduleInfo(): Promise<{ schemaConfigs: UserHomePrimaryMsgSchemaConfigs }>
      }
      editProfile: {
        useTempImageAsProfileImage(_: { as: profileImage; tempId: string }): Promise<useTempFileResult>
        editProfileInfo(_: {
          userHomeId: userHomeId
          profileInfo: deep_partial<profileInfo>
        }): Promise<ok_ko<void, { notFound: unknown; unknown: unknown }>>
      }
      userHome: {
        access(_: {
          by: by_user_id_or_user_home_id
        }): Promise<ok_ko<{ accessObject: user_home_access_object }, { notFound: unknown }>>
      }
    }
  }
  secondary: {
    userHome: {
      queue: {
        createUserHome(_: { userHome: userHomeRecord }): Promise<ok_ko<void>>
      }
      service: unknown
      sync: {
        iamUserExcerpt(_: { iamUserExcerpt: iamUserExcerpt }): Promise<ok_ko<void>>
      }
      query: {
        getUserHome(_: {
          by: by_user_id_or_user_home_id
        }): Promise<ok_ko<{ userHome: userHomeRecord }, { notFound: unknown }>>
      }
      write: {
        updatePartialProfileInfo(_: {
          id: userHomeId
          partialProfileInfo: deep_partial<profileInfo>
        }): Promise<ok_ko<{ userHomeId: userHomeId; userId: userId }>>
        useTempImageInProfile(_: { as: profileImage; id: userHomeId; tempId: string }): Promise<useTempFileResult>
      }
    }
  }
}
