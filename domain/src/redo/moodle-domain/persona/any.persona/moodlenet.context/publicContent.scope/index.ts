import { findEntities } from './findEntities.usecase'
import { instanceInfo } from './instanceInfo.usecase'

declare module '..' {
  interface Context {
    publicContent: publicContent
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type publicContent = moo.persona.scope<moo<Scope>>
export const publicContent: moo.gate.scope<publicContent> = {
  findEntities: findEntities,
  instanceInfo: instanceInfo,
}
