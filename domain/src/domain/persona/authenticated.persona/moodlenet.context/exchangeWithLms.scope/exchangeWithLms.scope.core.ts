import { resources } from './resources.usecase/resources.usecase.core'
import type { exchangeWithLms as exchangeWithLms_def } from '.'
export const exchangeWithLms: moo.core.scope<exchangeWithLms_def> = {
  resources,
}
