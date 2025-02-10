import { get, get_Gate } from './get.usecase/get.usecase'

export type session = moo.persona.scope<{ get: get }>

export const session_Gate: moo.gate.scope<session> = { get: get_Gate }
