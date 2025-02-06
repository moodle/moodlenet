import { access, accessGate } from './access.context'

export type anonymous = moo.persona<{ access: access }> //,{a:1}>

export const anonymousGate: moo.gate.persona<anonymous> = {
  access: accessGate,
}
