import { email_address } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { UserDataConfigs } from '../../persona/any.persona/any.persona'

export type userAccount = moo.DefService<{
  model: moo.DefModel<UserAccountModel>
  tokens: never
}>

export type ProfileInfo = {
  displayName: string
}

// export type ResourceDraftSpace = {}

// export type CollectionDraftSpace = {}

export type Profile = {
  info: moo.EntityData<'w', ProfileInfo>
  // avatar: moo.Asset<{
  //   optional: true
  // }>
  // background: moo.Asset<{
  //   optional: true
  // }>
}

export type UserSpace = {
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

export type UserAccountModel = {
  configs: moo.StaticData<'w', UserAccountConfigs>
  user: moo.IdSpaceMap<UserSpace, { emailEquals: string }>
}

export type UserAccountConfigs = {
  dataConfigs: {
    userData: UserDataConfigs
  }
}
