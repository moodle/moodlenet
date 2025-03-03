import { info } from './info.usecase/info.usecase.core'
import type { curateMyProfile as curateMyProfile_def } from '.'
export const curateMyProfile: moo.core.scope<curateMyProfile_def> = {
  info,
}
