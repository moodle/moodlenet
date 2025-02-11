/* eslint-disable @typescript-eslint/no-namespace */
import { myAccount } from './myAccount.context'
declare global {
  namespace moo {
    interface Personas {
      authenticated: authenticated
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Persona {}

export type authenticated = moo.persona<moo.typ<Persona>>
export const authenticated: moo.gate.persona<authenticated> = {
  myAccount: myAccount,
}
