import { search } from './search.usecase/search.usecase.core'
import type { curatePreferences as curatePreferences_def } from '.'
export const curatePreferences: moo.core.scope<curatePreferences_def> = {
  search,
}
