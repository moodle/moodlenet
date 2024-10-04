import type { d_u, deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { user_id } from '../iam'
import {
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
export type user_home_event = pretty<UserHomeEvents>

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
}
export interface UserHomeSecondary {
  db: {
    getConfigs(): Promise<{ configs: Configs }>
    createUserHome(_: { userHome: user_home_record }): Promise<ok_ko<void>>
    getUserHome(_: {
      by: by_user_id_or_user_home_id
    }): Promise<ok_ko<{ userHome: user_home_record }, { notFound: unknown }>>
    align_userExcerpt(_: {
      userExcerpt: user_excerpt
    }): Promise<ok_ko<{ userHome: user_home_record }, { notFound: unknown }>>
    updatePartialConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<void>>
    updatePartialProfileInfo(_: {
      id: user_home_id
      partialProfileInfo: deep_partial<ProfileInfo>
    }): Promise<ok_ko<void>>
  }
}

export interface UserHomeEvents {
  edits: {
    profileInfo(_: {
      changes: deep_partial<ProfileInfo>
      userHomeId: user_home_id
      userId: user_id
    }): unknown
  }
}
