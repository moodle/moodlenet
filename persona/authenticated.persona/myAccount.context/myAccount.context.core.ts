import { manage } from './manage.scope/manage.scope.core'
import { security } from './security.scope/security.scope.core'
import type { myAccount as myAccount_def } from '.'
export const myAccount: moo.core.context<myAccount_def> = {
  manage,
  security,
}
