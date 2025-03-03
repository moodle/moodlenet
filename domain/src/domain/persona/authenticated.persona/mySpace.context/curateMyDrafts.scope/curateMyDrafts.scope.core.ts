import { collection } from './collection.usecase/collection.usecase.core'
import { resource } from './resource.usecase/resource.usecase.core'
import type { curateMyDrafts as curateMyDrafts_def } from '.'
export const curateMyDrafts: moo.core.scope<curateMyDrafts_def> = {
  collection,
  resource,
}
