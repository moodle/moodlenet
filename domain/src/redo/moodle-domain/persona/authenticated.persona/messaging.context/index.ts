import { email } from './email.scope'

declare module '..' {
  interface Persona {
    messaging: messaging
  }
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context {}

export type messaging = moo.persona.context<moo<Context>>
export const messaging: moo.gate.provider.context<messaging> = {
  email,
}
