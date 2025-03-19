import type { fullTextSearch as fullTextSearchType } from '.'
import { collections } from './collections.core'
import { contributors } from './contributors.core'
import { resources } from './resources.core'
import { subjects } from './subjects.core'
export const fullTextSearch: moo.core.usecase<fullTextSearchType> = {
  collections,
  contributors,
  resources,
  subjects,
}
