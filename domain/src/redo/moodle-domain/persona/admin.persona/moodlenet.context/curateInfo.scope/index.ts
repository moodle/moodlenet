import { general } from './general.usecase'

declare module '..' {
  interface Context {
    curateInfo: curateInfo
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type curateInfo = moo.persona.scope<moo<Scope>>
export const curateInfo: moo.gate.provider.scope<curateInfo> = {
  general,
}
