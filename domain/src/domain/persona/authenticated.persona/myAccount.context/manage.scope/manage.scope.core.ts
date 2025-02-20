import { deleteIt } from './deleteIt.usecase/deleteIt.usecase.core'
import type { manage as manageType } from '.'
export const manage: moo.core.scope<manageType> ={
  deleteIt
}
