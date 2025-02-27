import { signed_token } from '@moodle/lib-types'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
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
export type accessControl = moo.model<accessControlModel, xTypes>

export type accessControlModel = {
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
}

export type accessControlUserSpace = {
  permissions: moo.model.type.atom<never, { role: userRole }>
  session: moo.model.type.idSpaceMap<{ auth: moo.model.type.atom<never, authSession> }>
}
