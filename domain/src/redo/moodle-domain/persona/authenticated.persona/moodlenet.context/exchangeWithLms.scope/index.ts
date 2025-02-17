import { resources } from './resources.usecase'

declare module '..' {
  interface Context {
    exchangeWithLms: exchangeWithLms
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type exchangeWithLms = moo.persona.scope<moo<Scope>>
export const exchangeWithLms: moo.gate.provider.scope<exchangeWithLms> = {
  resources,
}
