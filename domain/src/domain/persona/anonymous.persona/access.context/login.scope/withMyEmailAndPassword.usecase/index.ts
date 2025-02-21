import { login } from './login.endpoint'
declare module '..' {
  interface Scope {
    withMyEmailAndPassword: withMyEmailAndPassword
  }
}

export type withMyEmailAndPassword = moo.persona.usecase<{
  login: login
}>

export const withMyEmailAndPassword: moo.gate.provider.usecase<withMyEmailAndPassword> = {
  login,
}
