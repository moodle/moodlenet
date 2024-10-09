import type { d_u, deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { user_id } from '../iam'
import {
  profileImage,
  ProfileInfo,
  user_excerpt,
  user_home_access_object,
  user_home_id,
  user_home_record,
} from './types'
import { Configs } from './types/configs'
export * from './types'

export type user_home_primary = pretty<UserHomePrimary>
export type user_home_secondary = pretty<UserHomeSecondary>

export type by_user_id_or_user_home_id = d_u<
  { user_home: { user_home_id: user_home_id }; user: { user_id: user_id } },
  'idOf'
>
export interface UserHomePrimary {
  write: {
    editProfileInfo(_: {
      user_home_id: user_home_id
      profileInfo: deep_partial<ProfileInfo>
    }): Promise<ok_ko<void, { notFound: unknown; unknown: unknown }>>
  }
  read: {
    configs(): Promise<{ configs: Configs }>
    userHome(_: {
      by: by_user_id_or_user_home_id
    }): Promise<ok_ko<{ accessObject: user_home_access_object }, { notFound: unknown }>>
  }
  uploads: {
    useImageInProfile(_: {
      as: profileImage
      tempId: string
    }): Promise<ok_ko<void, { tempNotFound: unknown; invalidImage: unknown; unknown: unknown }>>
  }
}
export interface UserHomeSecondary {
  alignDb: {
    userExcerpt(_: {
      userExcerpt: user_excerpt
    }): Promise<ok_ko<{ userHome: user_home_record }, { notFound: unknown }>>
  }
  db: {
    getConfigs(): Promise<{ configs: Configs }>
    createUserHome(_: { userHome: user_home_record }): Promise<ok_ko<void>>
    getUserHome(_: {
      by: by_user_id_or_user_home_id
    }): Promise<ok_ko<{ userHome: user_home_record }, { notFound: unknown }>>
    updatePartialConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<Configs>>
    updatePartialProfileInfo(_: {
      id: user_home_id
      partialProfileInfo: deep_partial<ProfileInfo>
    }): Promise<ok_ko<{ userHomeId: user_home_id; userId: user_id }>>
  }

  storage: {
    createUserHome(_: { userHomeId: user_home_id }): Promise<ok_ko<void>>
    useImageInProfile(_: {
      as: profileImage
      id: user_home_id
      tempId: string
    }): Promise<
      ok_ko<void, { tempNotFound: unknown; invalidImage: unknown; unknown: { error: string } }>
    >
  }
}
