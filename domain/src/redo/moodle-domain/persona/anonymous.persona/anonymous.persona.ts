import { access, access_Gate } from './access.context/access.context'

export type anonymous = moo.persona<{ access: access }>

export const anonymous_Gate: moo.gate.persona<anonymous> = {
  access: access_Gate,
}
