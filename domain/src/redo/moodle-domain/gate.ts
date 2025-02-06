import { anonymousGate } from './persona/anonymous.persona/anonymous.persona'
import { anyGate } from './persona/any.persona/any.persona'

export const Gate: moo.gate.provider = {
  anonymous: anonymousGate,
  any: anyGate,
}
