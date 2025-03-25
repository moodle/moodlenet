import { entity } from './entity.usecase'
import { followers } from './followers.usecase'
import { fullTextSearch } from './fullTextSearch.usecase'

declare module '..' {
  interface Context {
    viewPublicContent: viewPublicContent
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type viewPublicContent = moo.persona.scope<moo<Scope>>
export const viewPublicContent: moo.gate.provider.scope<viewPublicContent> = {
  fullTextSearch,
  entity,
  followers,
}
