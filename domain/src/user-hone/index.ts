import type { deep_partial, ok_ko, pretty } from '@moodle/lib-types'
import { user_id } from '../iam'
import { ProfileInfo, user_home_record } from './types'
import { Configs } from './types/configs'
export * from './types'

export type user_home_primary = pretty<UserHomePrimary>
export type user_home_secondary = pretty<UserHomeSecondary>

export interface UserHomePrimary {
  myHome: {
    configs(): Promise<{ configs: Configs }>
    editMyProfileInfo(_: { profileInfo: deep_partial<ProfileInfo> }): Promise<ok_ko<void>>
  }
  // system: {
  //
  // }
  admin: {
    updatePartialUserHomeConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<void>>
  }
}
export interface UserHomeSecondary {
  db: {
    getConfigs(): Promise<{ configs: Configs }>
    createUserHome(_: { userHome: user_home_record }): Promise<ok_ko<void>>
    updatePartialConfigs(_: { partialConfigs: deep_partial<Configs> }): Promise<ok_ko<void>>
    updatePartialProfileInfo(_: {
      userId: user_id
      partialProfileInfo: deep_partial<ProfileInfo>
    }): Promise<ok_ko<void>>
  }
}
