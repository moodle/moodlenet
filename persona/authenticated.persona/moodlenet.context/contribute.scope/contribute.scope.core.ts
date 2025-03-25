import { publishMyContent } from './publishMyContent.usecase/publishMyContent.usecase.core'
import type { contribute as contribute_def } from '.'
export const contribute: moo.core.scope<contribute_def> = {
  publishMyContent,
}
