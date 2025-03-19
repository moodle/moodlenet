import { requestLink } from './requestLink.endpoint'
import { setNew } from './setNew.endpoint'
declare module '..' {
  interface Scope {
    resetMyPassword: resetMyPassword
  }
}

export type resetMyPassword = moo.persona.usecase<{
  requestLink: requestLink
  setNew: setNew
}>

export const resetMyPassword: moo.gate.provider.usecase<resetMyPassword> = {
  requestLink,
  setNew,
}
