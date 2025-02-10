import { session, session_Gate } from './session.scope/session.scope'

export type system = moo.persona.context<{ session: session }>

export const system_Gate: moo.gate.context<system> = {
  session: session_Gate,
}
