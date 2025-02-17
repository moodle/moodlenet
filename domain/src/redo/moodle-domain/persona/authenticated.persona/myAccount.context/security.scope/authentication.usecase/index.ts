import { changeMyPassword } from './changeMyPassword.endopoint'
declare module '..' {
  interface Scope {
    authentication: authentication
  }
}

export type authentication = moo.persona.usecase<{ changeMyPassword: changeMyPassword }>
export const authentication: moo.gate.provider.usecase<authentication> = {
  changeMyPassword,
}
