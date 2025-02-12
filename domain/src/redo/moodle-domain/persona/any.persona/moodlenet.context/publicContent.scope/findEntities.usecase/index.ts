import { collections } from './collections.endpoint'
import { contributors } from './contributors.endpoint'
import { resources } from './resources.endpoint'
import { subjects } from './subjects.endpoint'

declare module '..' {
  interface Scope {
    findEntities: findEntities
  }
}

export type findEntities = moo.persona.usecase<{
  collections: collections
  resources: resources
  contributors: contributors
  subjects: subjects
}>
export const findEntities: moo.gate.usecase<findEntities> = {
  collections: collections,
  resources: resources,
  contributors: contributors,
  subjects: subjects,
}
