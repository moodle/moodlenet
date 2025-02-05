import { email_address } from '@moodle/lib-types'
import * as moo from 'moodle-domain'
import { UserDataConfigs } from '../../persona/any.persona/any.persona'

export type userAccount = moo.DefService<{
  model: moo.DefModel<UserAccountModel>
  tokens: never
}>

export type profileInfo = {
  displayName: string
}

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

export type profile = {
  info: moo.EntityData<'w', profileInfo>
  avatar: moo.Asset<{ optional: true }>
  background: moo.Asset<{ optional: true }>
}

export type userSpace = {
  email: moo.EntityData<'w', { address: email_address }>
  password: moo.EntityData<'w', { hash: string }>
  profile: profile
}

export type UserAccountModel = {
  configs: moo.StaticData<'w', UserAccountConfigs>
  user: moo.IdSpaceMap<userSpace, { emailEquals: string }>
}

export type UserAccountConfigs = {
  dataConfigs: {
    userData: UserDataConfigs
  }
}
