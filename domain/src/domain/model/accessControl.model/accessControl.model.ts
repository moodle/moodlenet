import { email_address, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
import { userProfileInfo } from '../userAccount.model'
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
  user: moo.model.ops.collection<accessControlUserSpace, { emailEquals: string }>
  getTokenPermissionsInfo: moo.model.ops.endpoint<['query', { authSessionToken: signed_token | null }, { info: moo.permissions.user.info }]>
}

export type accessControlUserSpace = {
  getUserPermissionsDepsForAuthSessionId: moo.model.ops.endpoint<['query', { authSessionId: string }, Either<NOT_FOUND, { deps: userPermissionsDeps }>]>
  auth: moo.model.ops.atom<'ephem', { role: userRole }>
  info: moo.model.ops.atom<'view', { email: email_address } & Pick<userProfileInfo, 'displayName'>>
  activateNewAuthSession: moo.model.ops.endpoint<['sync', void, Either<NOT_FOUND, { authSessionToken: signed_token }>]>
  activeAuthSession: moo.model.ops.collection<{ authSession: moo.model.ops.atom<'ephem', authSession> }>
  // getPermissionsInfo: moo.model.type.endpoint<['query', void, { info: moo.permissions.user.info }]>
}

export type userPermissionsDeps = {
  roleConfigs: roleConfigs
  // userRole: userRole
  authSessionIdExists: boolean
  permissionsConfigTree: moo.permissions.config.tree
}
