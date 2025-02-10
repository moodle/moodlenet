import { login, login_Gate } from './login.endpoint'
export type withMyEmail = moo.persona.usecase<{
  emailLogin: login
  [moo.persona.usecase.modelTypes]: {
    jwtTokens: {
      userSession: moo.session.user
    }
  }
}>

export const withMyEmail_Gate: moo.gate.usecase<withMyEmail> = {
  emailLogin: login_Gate,
}
