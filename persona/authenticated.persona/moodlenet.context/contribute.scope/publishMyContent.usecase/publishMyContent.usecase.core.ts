import type { publishMyContent as publishMyContentType } from '.'
import { collection } from './collection.core'
import { resource } from './resource.core'
export const publishMyContent: moo.core.usecase<publishMyContentType> = {
  collection,
  resource,
}
