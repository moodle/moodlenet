import { email_address } from '@moodle/lib-types'
import { UserDataConfigs } from '../../persona/any.persona/any.persona'

export type userAccount = moo.model<UserAccountModel>

export type profileInfo = {
  displayName: string
}

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

export type profile = {
  info: moo.model.type.entityData<'w', profileInfo>
  avatar: moo.model.type.asset<{ optional: true }>
  background: moo.model.type.asset<{ optional: true }>
}

export type userSpace = {
  email: moo.model.type.entityData<'w', { address: email_address }>
  password: moo.model.type.entityData<'w', { hash: string }>
  profile: profile
}

export type UserAccountModel = {
  configs: moo.model.type.staticData<'w', UserAccountConfigs>
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}

export type UserAccountConfigs = {
  dataConfigs: {
    userData: UserDataConfigs
  }
}
