import { eduDraftSchemaOverrides } from '../../../../model/userAccount.model'
import { collection } from './collection.usecase'
import { resource } from './resource.usecase'
declare module '..' {
  interface Context {
    curateMyDrafts: curateMyDrafts
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {
  [moo.tags.configs]: {
    schemas: curateMyDraftsScopeSchemaConfigs
  }
}

export type curateMyDrafts = moo.persona.scope<moo<Scope>>
export const curateMyDrafts: moo.gate.provider.scope<curateMyDrafts> = {
  collection,
  resource,
}

export type curateMyDraftsScopeSchemaConfigs = {
  eduDraftSchemaOverrides: eduDraftSchemaOverrides
}
