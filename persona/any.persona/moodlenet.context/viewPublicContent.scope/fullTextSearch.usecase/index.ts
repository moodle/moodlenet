import { collections } from './collections.endpoint'
import { contributors } from './contributors.endpoint'
import { resources } from './resources.endpoint'
import { subjects } from './subjects.endpoint'

declare module '..' {
  interface Scope {
    fullTextSearch: fullTextSearch
  }
}

export type fullTextSearch = moo.persona.usecase<{
  collections: collections
  resources: resources
  contributors: contributors
  subjects: subjects
}>
export const fullTextSearch: moo.gate.provider.usecase<fullTextSearch> = {
  collections,
  contributors,
  subjects,
  resources,
}
