import { manage } from './manage.scope/manage.scope.core'
import { security } from './security.scope/security.scope.core'
import type { myAccount as myAccountType } from '.'
export const myAccount: moo.core.context<myAccountType> ={
  manage,
  security
}
