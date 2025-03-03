import { entity } from './entity.usecase/entity.usecase.core'
import { followers } from './followers.usecase/followers.usecase.core'
import { fullTextSearch } from './fullTextSearch.usecase/fullTextSearch.usecase.core'
import type { viewPublicContent as viewPublicContent_def } from '.'
export const viewPublicContent: moo.core.scope<viewPublicContent_def> = {
  entity,
  followers,
  fullTextSearch,
}
