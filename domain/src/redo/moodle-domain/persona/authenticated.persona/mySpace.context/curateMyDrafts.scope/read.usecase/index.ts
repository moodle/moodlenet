import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'
declare module '..' {
  interface Scope {
    read: read
  }
}

export type read = moo.persona.usecase<{
  collection: collection
  resource: resource
}>

export const read: moo.gate.usecase<read> = {
  collection: collection,
  resource: resource,
}
