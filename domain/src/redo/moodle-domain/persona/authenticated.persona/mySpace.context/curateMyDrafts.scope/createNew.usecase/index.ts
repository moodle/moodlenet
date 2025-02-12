import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'
declare module '..' {
  interface Scope {
    createNew: createNew
  }
}

export type createNew = moo.persona.usecase<{
  collection: collection
  resource: resource
}>

export const createNew: moo.gate.usecase<createNew> = {
  collection: collection,
  resource: resource,
}
