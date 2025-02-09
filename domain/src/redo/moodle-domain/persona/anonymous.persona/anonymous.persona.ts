import { access, accessGate } from './access.context'

export type anonymous = moo.persona<{ access: access }>

export const anonymousGate: moo.gate.persona<anonymous> = {
  access: accessGate,
}
