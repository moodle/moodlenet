import { resetMyPassword } from './resetMyPassword.usecase/resetMyPassword.usecase'
import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase'
declare module '..' {
  interface Context {
    login: login
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type login = moo.persona.scope<moo.typ<Scope>>
export const login: moo.gate.scope<login> = {
  withMyEmail: withMyEmail,
  resetMyPassword: resetMyPassword,
}
