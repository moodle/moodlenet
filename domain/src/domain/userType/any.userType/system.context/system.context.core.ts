import { access } from './access.scope/access.scope.core'
import type { system as system_def } from './system.context'
export const system: moo.def.core.context<system_def> = {
  access,
}
