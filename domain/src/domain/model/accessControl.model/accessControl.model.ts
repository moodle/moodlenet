/* eslint-disable @typescript-eslint/no-namespace */
import { email_address, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { Option } from 'fp-ts/Option'
import { NOT_FOUND } from '../../../lib'
import { userId } from '../userAccount.model'
import { accessControlConfigs, authSession, roleConfigs, userRole } from './types'
export * from './types'

const MODEL_NAME = 'accessControl'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: accessControl
    }
    namespace Models {
      namespace statics {
        interface Configs {
          [MODEL_NAME]: accessControlConfigs
        }
      }
      namespace jwtTokens {
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
export type accessControl = moo.model<accessControlModel>

export type accessControlModel = {
  getTokenPermissionsInfo: moo.model.op<['query', { authSessionToken: signed_token | null }, { info: moo.permissions.user.info }]>
  user: {
    create: moo.model.op.set.create<userAccessControl>
    createAuthSession: moo.model.op<['sync', authSession, void]>
    activateNewAuthSession: moo.model.op<['sync', { userId: userId }, Either<NOT_FOUND, { authSessionToken: signed_token }>]>
    getData: moo.model.op<['query', { userId: userId }, Option<userAccessControlView>]>
    authSession: {
      get: moo.model.op<['query', { userId: userId; authSessionId: string }, Option<authSession>]>
      put: moo.model.op<['sync', { authSession: authSession }, void]>
    }
    getPermissionsDeps: moo.model.op<['query', { userId: userId; authSessionId: string }, Option<{ deps: userPermissionsDeps }>]>
  }
}
//type userInfo = { email: email_address } & Pick<userProfileInfo, 'displayName'>
export type userAccessControl = {
  userId: userId
  role: userRole
  // getPermissionsInfo: moo.model.type.endpoint<['query', void, { info: moo.permissions.user.info }]>
}
export type userAccessControlView = userAccessControl & {
  info: {
    displayName: string
    email: email_address
  }
}
export type userPermissionsDeps = {
  roleConfigs: roleConfigs
  // userRole: userRole
  authSessionIdExists: boolean
  permissionsConfigTree: moo.permissions.config.tree
}
