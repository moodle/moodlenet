import { authentication } from './authentication.usecase'

declare module '..' {
  interface Context {
    security: security
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type security = moo.persona.scope<moo<Scope>>
export const security: moo.gate.provider.scope<security> = {
  authentication,
}
