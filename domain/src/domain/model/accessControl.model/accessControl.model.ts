import { email_address, signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
import { userProfileInfo } from '../userAccount.model'
import { accessControlConfigs, authSession, userRole } from './types'
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
              id: string
              userId: string
              permissionsRev: string
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
  // storeAuthSession: moo.model.type.endpoint<['sync', { authSessionId: string; activeAuthSession: authSession }, void]>
  // getAuthSession: moo.model.type.endpoint<['query', { authSessionId: string }, Option<{ activeAuthSession: authSession }>]>
  user: moo.model.type.idSpaceMap<accessControlUserSpace, { emailEquals: string }>

  activateAuthSessionFor: moo.model.type.endpoint<
    ['sync', { userId: string }, Either<NOT_FOUND, { authSession: authSession; authSessionId: string; authSessionToken: signed_token }>]
  >

  getMyUserPermissions: moo.model.type.endpoint<['query', { authSessionToken: signed_token | null | undefined }, { info: moo.permissions.user.info }]>
}

export type accessControlUserSpace = {
  role: moo.model.type.atom<never, { role: userRole }>
  permissions: moo.model.type.atom<never, { rev: string; permissions: moo.permissions.user }>
  authSession: moo.model.type.idSpaceMap<{ authSession: moo.model.type.atom<never, authSession> }>
  info: moo.model.type.atom<'view', { email: email_address } & Pick<userProfileInfo, 'displayName'>>
}
