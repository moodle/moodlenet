/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address } from '@moodle/lib-types'
import { configs, profileInfo } from './types'
declare global {
  namespace moo {
    interface Models {
      userAccount: userAccount
    }
  }
}
export type userAccount = moo.model<userAccountModel>

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

export type profile = {
  info: moo.model.type.entityData<profileInfo>
  avatar: moo.model.type.asset<{ optional: true }>
  background: moo.model.type.asset<{ optional: true }>
}

export interface permissions {
  personaTypes: moo.model.type.entityData<{ types: moo.personaType[] }>
}

export type userSpace = {
  email: moo.model.type.entityData<{ address: email_address }>
  password: moo.model.type.entityData<{ hash: string }>
  permissions: permissions
  profile: profile
}

export type userAccountModel = {
  configs: configs
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}

