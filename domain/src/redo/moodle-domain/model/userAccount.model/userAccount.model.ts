/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'

export type userAccount = moo.model<userAccountModel>

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

export interface userSession {
  personaTypes: moo.model.type.entityData<{ types: moo.personaType[] }>
}

export type userSpace = {
  email: moo.model.type.entityData<{ address: email_address }>
  password: moo.model.type.entityData<{ hash: string }>
  session: userSession
  profile: profile
}

export type userAccountModel = {
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}



