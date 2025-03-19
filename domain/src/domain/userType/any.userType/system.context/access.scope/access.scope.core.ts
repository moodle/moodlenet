import type { access as access_def } from './access.scope'
import { session } from './session.usecase/session.usecase.core'
export const access: moo.def.core.scope<access_def> = {
  session,
}
