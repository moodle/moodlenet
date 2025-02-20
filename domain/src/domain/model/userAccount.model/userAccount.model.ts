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

export type images = {
  avatar: moo.model.type.asset<{ optional: true }>
  background: moo.model.type.asset<{ optional: true }>
}

export interface permissions {
  personaTypes: moo.model.type.entityData<{ types: moo.personaType[] }>
}

export type userSpace = {
  profileInfo: moo.model.type.entityData<profileInfo>
  email: moo.model.type.entityData<{ address: email_address }>
  password: moo.model.type.entityData<{ hash: string }>
  permissions: permissions
  images: images
}

export type userAccountModel = {
  [moo.configs]: configs
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}

