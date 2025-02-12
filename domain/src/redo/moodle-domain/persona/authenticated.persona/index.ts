/* eslint-disable @typescript-eslint/no-namespace */
import { myAccount } from './myAccount.context'
declare global {
  namespace moo {
    interface Personas {
      authenticated: authenticated
    }
  }
}
export interface Persona {
  [moo.persona.myContext]: { userId: string }
}

export type authenticated = moo.persona<moo.typ<Persona>>
export const authenticated: moo.gate.persona<authenticated> = {
  myAccount: myAccount,
}
