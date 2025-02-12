import { resetMyPassword } from './resetMyPassword.usecase'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase'
declare module '..' {
  interface Context {
    login: login
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type login = moo.persona.scope<moo.typ<Scope>>
export const login: moo.gate.scope<login> = {
  withMyEmailAndPassword: withMyEmailAndPassword,
  resetMyPassword: resetMyPassword,
}
