import { access } from './access.context/access.context'

export interface Anonymous {
  access: access
}

export type anonymous = moo.def.userType<moo<Anonymous>>
export const anonymous: moo.def.gate.provider.userType<anonymous> = { access: access }
