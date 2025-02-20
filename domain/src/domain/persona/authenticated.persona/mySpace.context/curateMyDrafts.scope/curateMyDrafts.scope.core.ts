import { collection } from './collection.usecase/collection.usecase.core'
import { resource } from './resource.usecase/resource.usecase.core'
import type { curateMyDrafts as curateMyDraftsType } from '.'
export const curateMyDrafts: moo.core.scope<curateMyDraftsType> ={
  collection,
  resource
}
