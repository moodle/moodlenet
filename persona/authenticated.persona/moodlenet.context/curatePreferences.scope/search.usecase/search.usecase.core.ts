import type { search as searchType } from '.'
import { edit } from './edit.core'
import { read } from './read.core'
export const search: moo.core.usecase<searchType> = {
  edit,
  read,
}
