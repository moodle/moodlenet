import { access } from './access.scope/access.scope'

export interface System {
  access: access
}

export type system = moo.def.userType.context<moo<System>>
export const system: moo.def.gate.provider.context<system> = {
  access: access,
}
