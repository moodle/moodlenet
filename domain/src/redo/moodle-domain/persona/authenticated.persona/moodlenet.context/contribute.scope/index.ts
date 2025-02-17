import { publishMyContent } from './publishMyContent.usecase'

declare module '..' {
  interface Context {
    contribute: contribute
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type contribute = moo.persona.scope<moo<Scope>>
export const contribute: moo.gate.provider.scope<contribute> = {
  publishMyContent,
}
