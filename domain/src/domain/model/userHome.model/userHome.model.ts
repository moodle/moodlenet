/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { d_u, email_address, signed_token, u_entry } from '@moodle/lib-types'
import { userHomeRecord, userHomeSchemas, userId, userProfileInfo } from './types'
export * from './types'

const MODEL_NAME = 'userHome'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: userHome
    }
    namespace Models {
      namespace userHome {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface IdentityProviders {}
      }
      namespace mailer {
        interface Templates {
          [MODEL_NAME]: {
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
          [MODEL_NAME]: userHomeSchemas
        }
      }
      namespace signedTokens {
        interface Payloads {
          [MODEL_NAME]: {
            confirmMyAccountDeletion: {
              userId: string
            }
          }
        }
      }
    }
  }
}

export type userHomeSpaceFilter = d_u<
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

export type userHome = moo.def.model<{
  create: moo.def.model.op<['sync', { id: u_entry<moo.Models.userHome.IdentityProviders>; userHomeRecord: userHomeRecord }, void]>
  find: moo.def.model.op.set.find<userHomeRecord, userHomeSpaceFilter>
  user: Record<
    userId,
    {
      profile: {
        info: Pick<moo.def.model.op.value<userProfileInfo>, 'put'>
        avatar: moo.def.model.op.asset
        background: moo.def.model.op.asset
      }
      email: moo.def.model.op.value.get<{ address: email_address }>
    }
  >
  idProviders: {
    get: moo.def.model.op<['query', void, Partial<moo.Models.userHome.IdentityProviders>]>
    put: moo.def.model.op<['sync', u_entry<moo.Models.userHome.IdentityProviders>, void]>
  }
}>
