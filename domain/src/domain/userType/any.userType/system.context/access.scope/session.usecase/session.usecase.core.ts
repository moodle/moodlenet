import { myOwn } from './myOwn.core'
import type { session as session_def } from './session.usecase'
export const session: moo.def.core.usecase<session_def> = {
  myOwn,
}
