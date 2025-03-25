import type { preferences as preferencesType } from '.'
import { edit } from './edit.core'
import { read } from './read.core'
export const preferences: moo.core.usecase<preferencesType> = {
  edit,
  read,
}
