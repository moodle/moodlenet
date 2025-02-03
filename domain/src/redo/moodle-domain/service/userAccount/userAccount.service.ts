import { email_address, typ } from '@moodle/lib-types'
import * as moo from 'moodle-domain'

export type userAccount = moo.DefService<{
  model: moo.DefModel<UserAccountModel>
  tokens: never
}>

export interface ProfileInfo {
  displayName: string
}

// export interface ResourceDraftSpace {}

// export interface CollectionDraftSpace {}

export interface Profile {
  info: moo.EntityData<'w', typ<ProfileInfo>>
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
  user: moo.IdSpaceMap<UserSpace, { emailEquals: string }>
}
