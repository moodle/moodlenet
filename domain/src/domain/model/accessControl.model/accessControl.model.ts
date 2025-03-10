import { d_u, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
import { userId } from '../userAccount.model'
import { accessControlConfigs, authSession, roleConfigs, userRole } from './types'
export * from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface Models {
      accessControl: accessControl
    }
    namespace Models {
      namespace jwtTokens {
        interface Payloads {
          accessControl: {
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
  [moo.tags.configs]: accessControlConfigs
  user: {
    create: moo.model.op.set.create<userAccessControl>
    authSession: {
      create: moo.model.op.set.create<authSession>
      query: moo.model.op.set.find<authSession, d_u<{ ids: { authSessionId: string; userId: userId } }, 'by'>, never>
    }
  }
  getPermissionsDeps: moo.model.op<['query', { authSessionId: string; userId: userId }, Either<NOT_FOUND, { deps: userPermissionsDeps }>]>
  activateNewAuthSession: moo.model.op<['sync', { userId: userId }, Either<NOT_FOUND, { authSessionToken: signed_token }>]>
  getTokenPermissionsInfo: moo.model.op<['query', { authSessionToken: signed_token | null }, { info: moo.permissions.user.info }]>
}
//type userInfo = { email: email_address } & Pick<userProfileInfo, 'displayName'>
type userAccessControl = {
  userId: userId
  role: userRole
  // getPermissionsInfo: moo.model.type.endpoint<['query', void, { info: moo.permissions.user.info }]>
}

export type userPermissionsDeps = {
  roleConfigs: roleConfigs
  // userRole: userRole
  authSessionIdExists: boolean
  permissionsConfigTree: moo.permissions.config.tree
}
