import type { session as sessionType } from '.'
import { myOwn } from './myOwn.core'
export const session: moo.core.usecase<sessionType> = {
  myOwn,
}
