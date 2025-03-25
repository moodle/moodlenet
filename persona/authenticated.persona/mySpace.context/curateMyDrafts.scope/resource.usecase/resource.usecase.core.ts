import type { resource as resourceType } from '.'
import { create } from './create.core'
import { edit } from './edit.core'
import { read } from './read.core'
import { setBackground } from './setBackground.core'
import { trash } from './trash.core'
export const resource: moo.core.usecase<resourceType> = {
  create,
  edit,
  read,
  setBackground,
  trash,
}
