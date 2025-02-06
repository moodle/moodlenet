import { signup, signupGate } from './access.context/signup.scope'

export type access = moo.persona.context<{ signup: signup }>

export const accessGate: moo.gate.context<access> = {
  signup: signupGate,
}
