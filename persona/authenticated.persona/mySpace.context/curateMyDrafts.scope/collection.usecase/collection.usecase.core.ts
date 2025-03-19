import type { collection as collectionType } from '.'
import { create } from './create.core'
import { edit } from './edit.core'
import { read } from './read.core'
import { setBackground } from './setBackground.core'
import { trash } from './trash.core'
export const collection: moo.core.usecase<collectionType> = {
  create,
  edit,
  read,
  setBackground,
  trash,
}
