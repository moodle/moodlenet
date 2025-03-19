import { withMyEmail } from './withMyEmail.usecase/withMyEmail.usecase'

export interface Signup {
  withMyEmail: withMyEmail
}

export type signup = moo.def.userType.scope<moo<Signup>>
export const signup: moo.def.gate.provider.scope<signup> = {
  withMyEmail,
}
