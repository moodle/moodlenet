import { collection } from './collection.endpoint'
import { contributor } from './contributor.endpoint'
import { resource } from './resource.endpoint'
import { subject } from './subject.endpoint'

declare module '..' {
  interface Scope {
    entity: entity
  }
}

export type entity = moo.persona.usecase<{
  collection: collection
  resource: resource
  contributor: contributor
  subject: subject
}>
export const entity: moo.gate.provider.usecase<entity> = {
  collection,
  contributor,
  subject,
  resource,
}
