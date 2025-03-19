import type { categories as categoriesType } from '.'
import { edit } from './edit.core'
import { read } from './read.core'
export const categories: moo.core.usecase<categoriesType> = {
  edit,
  read,
}
