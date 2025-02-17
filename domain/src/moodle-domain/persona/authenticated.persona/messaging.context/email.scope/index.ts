import { preferences } from './preferences.usecase'
import { send } from './send.usecase'
declare module '..' {
  interface Context {
    email: email
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type email = moo.persona.scope<moo<Scope>>
export const email: moo.gate.provider.scope<email> = {
  send,
  preferences,
}
