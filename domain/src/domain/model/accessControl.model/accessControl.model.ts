import { signed_token } from '@moodle/lib-types'
import { configs } from './types'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface Models {
      accessControl: accessControl
    }
  }
}
/* eslint-disable @typescript-eslint/no-invalid-void-type */
export type accessControl = moo.model<AccessControlModel>

export type activeSessionData = {
  session: moo.session.user
  userId: string
}

export type AccessControlModel = {
  [moo.configs]: configs
  sessionConfigs: moo.model.type.staticData<moo.session.configs>
  getUserSession: moo.model.type.endpoint<['query', { user: moo.session.info.user }, { session: moo.session.user }]>
  activateUserSessionToken: moo.model.type.endpoint<['query', { userId: string }, { session: moo.session.user; token: signed_token }]>
  getMyUserSessionInfo: moo.model.type.endpoint<['query', { sessionToken: signed_token | null | undefined }, { info: moo.session.info }]>
}
