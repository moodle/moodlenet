import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'
declare module '..' {
  interface Scope {
    trash: trash
  }
}

export type trash = moo.persona.usecase<{
  collection: collection
  resource: resource
}>

export const trash: moo.gate.usecase<trash> = {
  collection: collection,
  resource: resource,
}
