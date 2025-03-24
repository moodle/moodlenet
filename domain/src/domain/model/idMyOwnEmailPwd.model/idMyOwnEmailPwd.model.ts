/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { d_u, email_address, signed_token } from '@moodle/lib-types'
import { idMyOwnEmailPwdConfigs, idMyOwnEmailPwdEntry, idMyOwnEmailPwdRecord } from './types'
import { Option } from 'fp-ts/Option'
export * from './types'

const MODEL_NAME = 'idMyOwnEmailPwd'
declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: idMyOwnEmailPwd
    }
    namespace Models {
      namespace userHome {
        interface IdentityProviders {
          [MODEL_NAME]: idMyOwnEmailPwdEntry
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
          [MODEL_NAME]: idMyOwnEmailPwdConfigs
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

export type idMyOwnEmailPwdFilter = d_u<
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
export type idMyOwnEmailPwd = moo.def.model<{
  create: moo.def.model.op.set.create<idMyOwnEmailPwdRecord>
  findByEmail: moo.def.model.op<['query', { email: email_address }, Option<idMyOwnEmailPwdRecord>]>
}>
