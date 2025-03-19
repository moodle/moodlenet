import type { access as access_def } from '.'
import { session } from './session.usecase/session.usecase.core'
export const access: moo.core.scope<access_def> = {
  session,
}
