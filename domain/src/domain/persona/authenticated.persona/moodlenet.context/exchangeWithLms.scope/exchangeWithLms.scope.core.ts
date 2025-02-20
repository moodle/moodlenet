import { resources } from './resources.usecase/resources.usecase.core'
import type { exchangeWithLms as exchangeWithLmsType } from '.'
export const exchangeWithLms: moo.core.scope<exchangeWithLmsType> ={
  resources
}
