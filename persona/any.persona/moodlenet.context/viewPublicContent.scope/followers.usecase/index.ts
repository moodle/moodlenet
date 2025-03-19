import { collection } from './collection.endpoint'
import { contributor } from './contributor.endpoint'
import { subject } from './subject.endpoint'

declare module '..' {
  interface Scope {
    followers: followers
  }
}

export type followers = moo.persona.usecase<{
  collection: collection
  contributor: contributor
  subject: subject
}>
export const followers: moo.gate.provider.usecase<followers> = {
  collection,
  contributor,
  subject,
}
