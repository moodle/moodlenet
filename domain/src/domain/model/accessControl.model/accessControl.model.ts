import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
import { userAccountUserSpace } from '../userAccount.model'
import { accessControlConfigs, authSession, userRole } from './types'
export * from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface Models {
      accessControl: accessControl
    }
  }
}
type xTypes = moo.model.xTypes<{
  jwtTokens: {
    authSession: { authSessionId: string; userId: string }
  }
}>
/* eslint-disable @typescript-eslint/no-invalid-void-type */
export type accessControl = moo.model<AccessControlModel, xTypes>

export type AccessControlModel = {
  [moo.configs]: accessControlConfigs
  // storeAuthSession: moo.model.type.endpoint<['sync', { authSessionId: string; activeAuthSession: authSession }, void]>
  // getAuthSession: moo.model.type.endpoint<['query', { authSessionId: string }, Option<{ activeAuthSession: authSession }>]>
  user: moo.model.type.idSpaceMap<accessControlUserSpace, { emailEquals: string }>

  getAnonUserSession: moo.model.type.endpoint<['query', void, { session: moo.session.user }]>
  getUserSessionFor: moo.model.type.endpoint<['query', { userId: string }, Either<NOT_FOUND, { session: moo.session.user }>]>
  activateAuthSessionFor: moo.model.type.endpoint<
    ['sync', { userId: string }, Either<NOT_FOUND, { authSession: authSession; authSessionId: string; authSessionToken: signed_token }>]
  >

  getMyUserSessionInfo: moo.model.type.endpoint<['query', { authSessionToken: signed_token | null | undefined }, { info: moo.session.user.info }]>
  newUser: {
    emptyContributorSpace: moo.model.type.endpoint<
      ['query', { userAccountUserSpace: moo.model.type.sSpaceData<userAccountUserSpace> }, { accessControlUserSpace: moo.model.type.sSpaceData<accessControlUserSpace> }]
    >
  }
}

export type accessControlUserSpace = {
  permissions: moo.model.type.entityData<{ role: userRole }>
  activeSession: moo.model.type.idSpaceMap<{
    authSession: moo.model.type.entityData<authSession>
  }>
}
