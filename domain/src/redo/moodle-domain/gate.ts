import { anonymous_Gate } from './persona/anonymous.persona/anonymous.persona'
import { any_Gate } from './persona/any.persona/any.persona'

export const Gate: moo.gate.provider = {
  anonymous: anonymous_Gate,
  any: any_Gate,
}
