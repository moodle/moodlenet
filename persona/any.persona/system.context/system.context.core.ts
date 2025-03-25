import { access } from './access.scope/access.scope.core'
import type { system as system_def } from '.'
export const system: moo.core.context<system_def> = {
  access,
}
