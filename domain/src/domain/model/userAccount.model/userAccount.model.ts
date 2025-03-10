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

export type userAccountSpaceFilters = {
  emailEquals: string
}

export type userAccount = moo.model<{
  [moo.tags.configs]: userAccountConfigs
  userAccountSpace: moo.model.ops.collection<userAccountUserSpace, userAccountSpaceFilters>
}>

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

// export interface permissions {
//   personaTypes: moo.model.type.atom<'ephem', { types: moo.personaType[] }>
// }

export type userAccountUserSpace = {
  profile: {
    info: moo.model.ops.atom<'ephem', userProfileInfo>
    avatar: moo.model.ops.asset<'optional'>
    background: moo.model.ops.asset<'optional'>
  }
  email: moo.model.ops.atom<'ephem', { address: email_address }>
  password: moo.model.ops.atom<'ephem', { hash: string }>
}
