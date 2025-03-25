import { changeMyPassword } from './changeMyPassword.endpoint'
import { invalidateSession } from './invalidateSession.endopoint'
declare module '..' {
  interface Scope {
    authentication: authentication
  }
}

export type authentication = moo.persona.usecase<{ changeMyPassword: changeMyPassword; invalidateSession: invalidateSession }>
export const authentication: moo.gate.provider.usecase<authentication> = {
  changeMyPassword,
  invalidateSession,
}
