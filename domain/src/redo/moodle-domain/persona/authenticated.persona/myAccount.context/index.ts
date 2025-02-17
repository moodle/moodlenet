import { manage } from './manage.scope'
import { security } from './security.scope'

declare module '..' {
  interface Persona {
    myAccount: myAccount
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type myAccount = moo.persona.context<moo<Context>>
export const myAccount: moo.gate.provider.context<myAccount> = {
  security,
  manage,
}
