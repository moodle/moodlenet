import { signed_token } from '@moodle/lib-types'
import { activeAuthSessionInfo, accessControlConfigs } from './types'
import { Option } from 'fp-ts/Option'
import { Either } from 'fp-ts/Either'
import { NOT_FOUND } from '../../../lib'
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
  getAnonUserSession: moo.model.type.endpoint<['query', void, { session: moo.session.user }]>
  getUserSessionFor: moo.model.type.endpoint<['query', { userId: string }, Either<NOT_FOUND, { session: moo.session.user }>]>
  activateAuthSessionFor: moo.model.type.endpoint<['query', { userId: string }, Either<NOT_FOUND, { activeAuthSessionInfo: activeAuthSessionInfo }>]>
  storeAuthSessionInfo: moo.model.type.endpoint<['query', { authSessionId: string; activeAuthSessionInfo: activeAuthSessionInfo }, void]>
  getAuthSession: moo.model.type.endpoint<['query', { authSessionId: string }, Option<{ activeAuthSessionInfo: activeAuthSessionInfo }>]>
  getMyUserSessionInfo: moo.model.type.endpoint<['query', { authSessionToken: signed_token | null | undefined }, { info: moo.session.info }]>
}
