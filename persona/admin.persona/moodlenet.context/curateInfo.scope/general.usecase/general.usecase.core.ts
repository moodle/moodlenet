import type { general as generalType } from '.'
import { edit } from './edit.core'
import { read } from './read.core'
export const general: moo.core.usecase<generalType> = {
  edit,
  read,
}
