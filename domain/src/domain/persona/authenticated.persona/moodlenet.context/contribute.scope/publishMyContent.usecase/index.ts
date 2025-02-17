import { collection } from './collection.endpoint'
import { resource } from './resource.endpoint'

declare module '..' {
  interface Scope {
    publishMyContent: publishMyContent
  }
}

export type publishMyContent = moo.persona.usecase<{
  collection: collection
  resource: resource
}>
export const publishMyContent: moo.gate.provider.usecase<publishMyContent> = {
  collection,
  resource,
}
