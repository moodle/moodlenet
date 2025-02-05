import { any_, email_address, integer_schema, single_line_string_regex_parts } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { UserDataConfigs } from '../../persona/any.persona/any.persona'

export type userAccount = moo.DefService<{
  model: moo.DefModel<UserAccountModel>
  tokens: never
}>

export interface ProfileInfo {
  displayName: string
  [k: string]: any_
}

// export interface ResourceDraftSpace {}

// export interface CollectionDraftSpace {}

export interface Profile {
  info: moo.EntityData<'w', ProfileInfo>
  // avatar: moo.Asset<{
  //   optional: true
  // }>
  // background: moo.Asset<{
  //   optional: true
  // }>
}

export interface UserSpace {
  email: email_address
  secure: {
    passwordHash: string
  }
  profile: Profile
  // drafts: {
  //   resources: moo.IdSpaceMap<ResourceDraftSpace>
  //   collections: moo.IdSpaceMap<CollectionDraftSpace>
  // }
}

export interface UserAccountModel {
  configs: moo.StaticData<'w', UserAccountConfigs>
  user: moo.IdSpaceMap<UserSpace, { emailEquals: string }>
}

export interface UserAccountConfigs {
  dataConfigs: {
    userData: UserDataConfigs
  }
  [k: string]: any_
}
export const userAccountConfigs: UserAccountConfigs = {
  dataConfigs: {
    userData: {
      displayName: { max: integer_schema.parse(100), min: integer_schema.parse(100), regex: single_line_string_regex_parts },
      password: { max: integer_schema.parse(100), min: integer_schema.parse(100), regex: single_line_string_regex_parts },
      email: { max: integer_schema.parse(100) },
    },
  },
}
