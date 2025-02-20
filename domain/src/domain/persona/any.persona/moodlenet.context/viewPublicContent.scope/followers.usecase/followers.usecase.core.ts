import type { followers as followersType } from '.'
import { collection } from './collection.core'
import { contributor } from './contributor.core'
import { subject } from './subject.core'
export const followers: moo.core.usecase<followersType> = {
  collection,
  contributor,
  subject,
}
