import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'
declare module '..' {
  interface Scope {
    edit: edit
  }
}

export type edit = moo.persona.usecase<{
  collection: collection
  resource: resource
}>

export const edit: moo.gate.usecase<edit> = {
  collection: collection,
  resource: resource,
}
