import { deleteIt } from './deleteIt.usecase'
declare module '..' {
  interface Context {
    manage: manage
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type manage = moo.persona.scope<moo<Scope>>
export const manage: moo.gate.provider.scope<manage> = {
  deleteIt,
}
