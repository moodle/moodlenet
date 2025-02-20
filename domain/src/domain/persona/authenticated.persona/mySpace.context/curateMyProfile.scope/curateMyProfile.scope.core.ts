import { info } from './info.usecase/info.usecase.core'
import type { curateMyProfile as curateMyProfileType } from '.'
export const curateMyProfile: moo.core.scope<curateMyProfileType> ={
  info
}
