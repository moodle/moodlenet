/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { email_address, signed_token } from '@moodle/lib-types'
import { userAccountConfigs, userProfileInfo } from './types'
declare global {
  namespace moo {
    interface Models {
      userAccount: userAccount
    }
    namespace Models {
      namespace mailer {
        interface Templates {
          userAccount: {
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
        }
      }
      namespace jwtTokens {
        interface Payloads {
          userAccount: {
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
        }
      }
    }
  }
}

export type userAccount = moo.model<userAccountModel>

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

// export interface permissions {
//   personaTypes: moo.model.type.atom<never, { types: moo.personaType[] }>
// }

export type userAccountUserSpace = {
  profile: {
    info: moo.model.type.atom<never, userProfileInfo>
    avatar: moo.model.type.asset<'optional'>
    background: moo.model.type.asset<'optional'>
  }
  email: moo.model.type.atom<never, { address: email_address }>
  password: moo.model.type.atom<never, { hash: string }>
}

export type userAccountModel = {
  [moo.tags.configs]: userAccountConfigs
  userAccountSpace: moo.model.type.idSpaceMap<userAccountUserSpace, { emailEquals: string }>
}
