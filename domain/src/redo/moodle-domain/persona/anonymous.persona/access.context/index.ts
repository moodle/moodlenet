import { login } from './login.scope'
import { signup } from './signup.scope'

declare module '..' {
  interface Persona {
    access: access
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type access = moo.persona.context<moo<Context>>
export const access: moo.gate.provider.context<access> = {
  signup,
  login,
}
