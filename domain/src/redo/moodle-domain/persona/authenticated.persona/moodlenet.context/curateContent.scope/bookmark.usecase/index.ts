import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'

declare module '..' {
  interface Scope {
    bookmark: bookmark
  }
}

export type bookmark = moo.persona.usecase<{
  collection: collection
  resource: resource
}>
export const bookmark: moo.gate.provider.usecase<bookmark> = {
  collection,
  resource,
}
