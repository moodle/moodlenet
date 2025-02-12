import { collections } from './collections.endpoint'
import { resources } from './resources.endpoint'

declare module '..' {
  interface Scope {
    publishMyContent: publishMyContent
  }
}

export type publishMyContent = moo.persona.usecase<{
  collections: collections
  resources: resources
}>
export const publishMyContent: moo.gate.usecase<publishMyContent> = {
  collections: collections,
  resources: resources,
}
