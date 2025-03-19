import type { entity as entityType } from '.'
import { collection } from './collection.core'
import { contributor } from './contributor.core'
import { resource } from './resource.core'
import { subject } from './subject.core'
export const entity: moo.core.usecase<entityType> = {
  collection,
  contributor,
  resource,
  subject,
}
