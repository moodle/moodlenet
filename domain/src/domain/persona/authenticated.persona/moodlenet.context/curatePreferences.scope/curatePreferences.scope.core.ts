import { search } from './search.usecase/search.usecase.core'
import type { curatePreferences as curatePreferencesType } from '.'
export const curatePreferences: moo.core.scope<curatePreferencesType> ={
  search
}
