import { login } from './login.endpoint'
declare module '..' {
  interface Scope {
    withMyEmail: withMyEmail
  }
}

export type withMyEmail = moo.persona.usecase<{
  login: login
  [moo.persona.usecase.modelTypes]: {
    jwtTokens: {
      userSession: moo.session.user
    }
  }
}>

export const withMyEmail: moo.gate.usecase<withMyEmail> = {
  login: login,
}
