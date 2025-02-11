import { admin_Gate } from './persona/admin.persona/admin.persona'
import { anonymous_Gate } from './persona/anonymous.persona/anonymous.persona'
import { any_Gate } from './persona/any.persona/any.persona'
import { authenticated_Gate } from './persona/authenticated.persona/authenticated.persona'

export const Gate: moo.gate.provider = {
  admin: admin_Gate,
  authenticated: authenticated_Gate,
  anonymous: anonymous_Gate,
  any: any_Gate,
}
