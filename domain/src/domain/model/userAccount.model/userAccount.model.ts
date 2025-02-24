/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address, signed_token } from '@moodle/lib-types'
import { userAccountConfigs, profileInfo } from './types'
declare global {
  namespace moo {
    interface Models {
      userAccount: userAccount
    }
  }
}
type xTypes = moo.model.xTypes<{
  jwtTokens: {
    emailConfirmationToken: {
      passwordHash: string
      displayName: string
      email: email_address
    }
    resetPasswordToken: {
      userId: string
    }
    confirmMyAccountDeletion: {
      userId: string
    }
  }
  mailer: {
    userEmailConfirmation: {
      displayName: string
      confirmationToken: signed_token
    }
    resetPasswordLink: {
      displayName: string
      resetPasswordToken: signed_token
    }
    myAccountDeletionConfirmation: {
      displayName: string
      confirmMyAccountDeletionToken: signed_token
    }
    goodbye: {
      displayName: string
    }
  }
}>

export type userAccount = moo.model<userAccountModel, xTypes>

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
  [moo.configs]: userAccountConfigs
  user: moo.model.type.idSpaceMap<userSpace, { emailEquals: string }>
}

