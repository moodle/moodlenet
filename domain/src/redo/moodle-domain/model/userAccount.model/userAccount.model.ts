/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import { UserDataConfigs } from '../../persona/any.persona/any.persona'

export type userAccount = moo.model<UserAccountModel>

export type profileInfo = {
  displayName: string
}

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

export type profile = {
  info: moo.model.type.entityData<profileInfo>
  avatar: moo.model.type.asset<{ optional: true }>
  background: moo.model.type.asset<{ optional: true }>
}

export interface UserSession {
  personaTypes: moo.model.type.entityData<{ types: moo.personaType[] }>
}

export type userSpace = {
  email: moo.model.type.entityData<{ address: email_address }>
  password: moo.model.type.entityData<{ hash: string }>
  session: UserSession
  profile: profile
}

export type UserAccountModel = {
  configs: moo.model.type.staticData<UserAccountConfigs>
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}

export type UserAccountConfigs = {
  dataConfigs: {
    userData: UserDataConfigs
  }
}
