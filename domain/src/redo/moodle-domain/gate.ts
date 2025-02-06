import { anonymousGate } from './persona/anonymous.persona/anonymous.persona'
import { anyGate } from './persona/any.persona/any.persona'

export const Gate: moo.Gate = {
  anonymous: anonymousGate,
  any: anyGate,
}
