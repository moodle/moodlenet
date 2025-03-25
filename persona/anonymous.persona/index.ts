/* eslint-disable @typescript-eslint/no-namespace */
import { access } from './access.context'

declare global {
  namespace moo {
    interface Personas {
      anonymous: anonymous
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Persona {}

export type anonymous = moo.persona<moo<Persona>>
export const anonymous: moo.gate.provider.persona<anonymous> = {
  access,
}
