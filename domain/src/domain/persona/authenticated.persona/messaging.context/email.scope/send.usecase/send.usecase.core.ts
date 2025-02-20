import type { send as sendType } from '.'
import { user } from './user.core'
export const send: moo.core.usecase<sendType> = {
  user,
}
