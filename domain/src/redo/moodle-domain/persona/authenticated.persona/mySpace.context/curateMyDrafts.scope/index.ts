import { createNew } from './createNew.usecase'
import { edit } from './edit.usecase'
import { read } from './read.usecase'
import { trash } from './trash.usecase'
declare module '..' {
  interface Context {
    curateMyDrafts: curateMyDrafts
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Scope {}

export type curateMyDrafts = moo.persona.scope<moo<Scope>>
export const curateMyDrafts: moo.gate.scope<curateMyDrafts> = {
  createNew: createNew,
  edit: edit,
  trash: trash,
  read: read,
}
