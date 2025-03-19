import { info } from './info.usecase'
declare module '..' {
  interface Context {
    curateMyProfile: curateMyProfile
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type curateMyProfile = moo.persona.scope<moo<Scope>>
export const curateMyProfile: moo.gate.provider.scope<curateMyProfile> = {
  info,
}
