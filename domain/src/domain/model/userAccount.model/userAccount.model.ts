/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { d_u, email_address, signed_token } from '@moodle/lib-types'
import { userAccountConfigs, userAccountRecord, userId, userProfileInfo } from './types'
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

export * from './types'

export type userAccountSpaceFilters = d_u<
  {
    id: {
      email?: string
      userId?: string
    }
  },
  'by'
>

export type userAccount = moo.model<{
  [moo.tags.configs]: userAccountConfigs
  user: {
    create: moo.model.op.set.create<userAccountRecord>
    find: moo.model.op.set.find<userAccountRecord, userAccountSpaceFilters, never>
    userId: Record<
      userId,
      {
        profile: {
          info: Pick<moo.model.op.atom<userProfileInfo>, 'put'>
          avatar: moo.model.op.asset
          background: moo.model.op.asset
        }
        email: moo.model.op.atom.get<{ address: email_address }>
        password: moo.model.op.atom<{ hash: string }>
      }
    >
  }
}>

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

// export interface permissions {
//   personaTypes: moo.model.type.atom<'ephem', { types: moo.personaType[] }>
// }

