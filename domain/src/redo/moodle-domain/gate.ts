import { admin } from './persona/admin.persona'
import { access } from './persona/anonymous.persona'
import { any__ } from './persona/any.persona'
import { authenticated } from './persona/authenticated.persona'

export const Gate: moo.gate.provider = {
  admin: admin,
  authenticated: authenticated,
  anonymous: access,
  any: any__,
}
