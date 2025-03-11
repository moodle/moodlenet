/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { d_u, email_address, signed_token } from '@moodle/lib-types'
import { userAccountConfigs, userAccountRecord, userAccountSchemas, userId, userProfileInfo } from './types'
const MODEL_NAME = 'userAccount'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: userAccountModel
    }
    namespace Models {
      namespace mailer {
        interface Templates {
          [MODEL_NAME]: {
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
      namespace statics {
        interface Schemas {
          [MODEL_NAME]: userAccountSchemas
        }
        interface Configs {
          [MODEL_NAME]: userAccountConfigs
        }
      }
      namespace jwtTokens {
        interface Payloads {
          [MODEL_NAME]: {
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

export type userAccountSpaceFilter = d_u<
  {
    id: d_u<
      {
        email: { email: string }
        userId: { userId: userId }
      },
      'type'
    >
  },
  'by'
>

export type userAccountModel = moo.model<{
  create: moo.model.op.set.create<userAccountRecord>
  find: moo.model.op.set.find<userAccountRecord, userAccountSpaceFilter>
  user: Record<
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
}>

export type resourceDraftSpace = unknown

export type collectionDraftSpace = unknown

// export interface permissions {
//   personaTypes: moo.model.type.atom<'ephem', { types: moo.personaType[] }>
// }

