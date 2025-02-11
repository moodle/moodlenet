import { manage, manage_Gate } from './manage.scope/manage.scope'
import { security, security_Gate } from './security.scope/security.scope'

export type myAccount = moo.persona.context<{ security: security; manage: manage }>
export const myAccount_Gate: moo.gate.context<myAccount> = {
  security: security_Gate,
  manage: manage_Gate,
}
