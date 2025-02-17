import { resetMyPassword } from './resetMyPassword.usecase'
import { withMyEmailAndPassword } from './withMyEmailAndPassword.usecase'
declare module '..' {
  interface Context {
    login: login
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type login = moo.persona.scope<moo<Scope>>
export const login: moo.gate.provider.scope<login> = {
  withMyEmailAndPassword,
  resetMyPassword,
}
