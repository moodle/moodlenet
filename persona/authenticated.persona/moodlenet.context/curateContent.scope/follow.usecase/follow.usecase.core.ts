import type { follow as followType } from '.'
import { collection } from './collection.core'
import { contributor } from './contributor.core'
import { subject } from './subject.core'
export const follow: moo.core.usecase<followType> = {
  collection,
  contributor,
  subject,
}
