import { bookmark } from './bookmark.usecase/bookmark.usecase.core'
import { follow } from './follow.usecase/follow.usecase.core'
import { like } from './like.usecase/like.usecase.core'
import { report } from './report.usecase/report.usecase.core'
import type { curateContent as curateContent_def } from '.'
export const curateContent: moo.core.scope<curateContent_def> = {
  bookmark,
  follow,
  like,
  report,
}
