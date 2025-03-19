import { session } from './session.usecase/session.usecase'

export interface Scope {
  session: session
}

export type access = moo.def.userType.scope<moo<Scope>>
export const access: moo.def.gate.provider.scope<access> = { session: session }
