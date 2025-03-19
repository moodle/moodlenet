import { login } from './login.endpoint'

export interface WithMyEmailAndPassword {
  login: login
}

export type withMyEmailAndPassword = moo.def.userType.usecase<moo<WithMyEmailAndPassword>>

export const withMyEmailAndPassword: moo.def.gate.provider.usecase<withMyEmailAndPassword> = {
  login,
}
