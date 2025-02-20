import { categories } from './categories.usecase/categories.usecase.core'
import type { curatePreferences as curatePreferencesType } from '.'
export const curatePreferences: moo.core.scope<curatePreferencesType> ={
  categories
}
