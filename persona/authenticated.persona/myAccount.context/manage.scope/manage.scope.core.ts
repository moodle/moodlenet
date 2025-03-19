import { deleteIt } from './deleteIt.usecase/deleteIt.usecase.core'
import type { manage as manage_def } from '.'
export const manage: moo.core.scope<manage_def> = {
  deleteIt,
}
