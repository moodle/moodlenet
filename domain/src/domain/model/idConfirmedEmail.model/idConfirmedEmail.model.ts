/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { d_u, email_address, signed_token } from '@moodle/lib-types'
import { idConfirmedEmailConfigs, idConfirmedEmailEntry, idConfirmedEmailRecord } from './types'
import { Option } from 'fp-ts/Option'
export * from './types'

const MODEL_NAME = 'idConfirmedEmail'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: idConfirmedEmail
    }
    namespace Models {
      namespace userHome {
        interface IdentityProviders {
          [MODEL_NAME]: idConfirmedEmailEntry
        }
      }
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
          }
        }
      }
      namespace statics {
        interface Configs {
          [MODEL_NAME]: idConfirmedEmailConfigs
        }
      }
      namespace signedTokens {
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
          }
        }
      }
    }
  }
}

export type idConfirmedEmailFilter = d_u<
  {
    id: d_u<
      {
        email: { email: string }
      },
      'type'
    >
  },
  'by'
>
export type idConfirmedEmail = moo.def.model<{
  create: moo.def.model.op.set.create<idConfirmedEmailRecord>
  findByEmail: moo.def.model.op<['query', { email: email_address }, Option<idConfirmedEmailRecord>]>
}>
