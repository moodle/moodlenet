import { session } from './session.usecase/session.usecase.core'
import type { access as access_def } from '.'
export const access: moo.core.scope<access_def> = {
  session,
}
