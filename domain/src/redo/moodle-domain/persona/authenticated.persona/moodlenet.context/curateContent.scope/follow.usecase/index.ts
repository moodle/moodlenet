import { collection } from './collection.endpoint'
import { contributor } from './contributor.endpoint'
import { subject } from './subject.endpoint'

declare module '..' {
  interface Scope {
    follow: follow
  }
}

export type follow = moo.persona.usecase<{
  collection: collection
  contributor: contributor
  subject: subject
}>
export const follow: moo.gate.provider.usecase<follow> = {
  collection,
  contributor,
  subject,
}
