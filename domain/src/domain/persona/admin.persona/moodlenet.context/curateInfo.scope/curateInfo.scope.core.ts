import { general } from './general.usecase/general.usecase.core'
import type { curateInfo as curateInfoType } from '.'
export const curateInfo: moo.core.scope<curateInfoType> ={
  general
}
