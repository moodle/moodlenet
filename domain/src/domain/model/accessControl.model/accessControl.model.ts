/* eslint-disable @typescript-eslint/no-namespace */
import { email_address, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { NOT_FOUND } from '../../../lib'
import { userId } from '../userHome.model'
import { accessControlConfigs, authSession, roleConfigs, userRole } from './types'
import { any_def } from './gate/'
export * from './types'

const MODEL_NAME = 'accessControl'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: accessControl
    }
    namespace UserType {
      interface Any {
        [MODEL_NAME]: any_def
      }
    }
    namespace Models {
      namespace statics {
        interface Configs {
          [MODEL_NAME]: accessControlConfigs
        }
      }
      namespace signedTokens {
        interface Payloads {
          [MODEL_NAME]: {
            authSession: {
              authSessionId: string
              userId: string
            }
          }
        }
      }
    }
  }
}

/* eslint-disable @typescript-eslint/no-invalid-void-type */
export type accessControl = moo.def.model<accessControlModel>

export type accessControlModel = {
  getTokenPoliciesInfo: moo.def.model.op<['query', { authSessionToken: signed_token | null }, { info: moo.def.policies.user.info }]>
  user: {
    create: moo.def.model.op.set.create<userAccessControl>
    createAuthSession: moo.def.model.op<['sync', authSession, void]>
    activateNewAuthSession: moo.def.model.op<['sync', { userId: userId }, Either<NOT_FOUND, { authSessionToken: signed_token }>]>
    getData: moo.def.model.op<['query', { userId: userId }, Option<userAccessControlView>]>
    authSession: {
      get: moo.def.model.op<['query', { userId: userId; authSessionId: string }, Option<authSession>]>
      put: moo.def.model.op<['sync', { authSession: authSession }, void]>
    }
    getPoliciesDeps: moo.def.model.op<['query', { userId: userId; authSessionId: string }, Option<{ deps: userPoliciesDeps }>]>
  }
}
//type userInfo = { email: email_address } & Pick<userProfileInfo, 'displayName'>
export type userAccessControl = {
  userId: userId
  role: userRole
  // getPoliciesInfo: moo.model.type.endpoint<['query', void, { info: moo.policies.user.info }]>
}
export type userAccessControlView = userAccessControl & {
  info: {
    displayName: string
    email: email_address
  }
}
export type userPoliciesDeps = {
  roleConfigs: roleConfigs
  // userRole: userRole
  authSessionIdExists: boolean
  policiesConfigTree: moo.def.policies.config.tree
}
