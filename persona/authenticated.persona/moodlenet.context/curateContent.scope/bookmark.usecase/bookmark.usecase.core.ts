import type { bookmark as bookmarkType } from '.'
import { collection } from './collection.core'
import { resource } from './resource.core'
export const bookmark: moo.core.usecase<bookmarkType> = {
  collection,
  resource,
}
