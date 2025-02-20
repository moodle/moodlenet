import { publishMyContent } from './publishMyContent.usecase/publishMyContent.usecase.core'
import type { contribute as contributeType } from '.'
export const contribute: moo.core.scope<contributeType> ={
  publishMyContent
}
