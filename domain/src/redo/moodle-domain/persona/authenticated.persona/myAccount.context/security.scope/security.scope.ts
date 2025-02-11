import { authentication, authentication_Gate } from './authentication.usecase/authentication.usecase'

export type security = moo.persona.scope<{ authentication: authentication }>

export const security_Gate: moo.gate.scope<security> = {
  authentication: authentication_Gate,
}
