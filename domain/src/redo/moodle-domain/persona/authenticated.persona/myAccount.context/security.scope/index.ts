import { authentication } from './authentication.usecase/authentication.usecase'

declare module '..' {
  interface Context {
    security: security
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type security = moo.persona.scope<moo.typ<Scope>>
export const security: moo.gate.scope<security> = {
  authentication: authentication,
}
