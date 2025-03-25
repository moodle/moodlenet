import { admin } from '../persona/admin.persona'
import { anonymous } from '../persona/anonymous.persona'
import { any__ } from '../persona/any.persona'
import { authenticated } from '../persona/authenticated.persona'
import { moderator } from '../persona/moderator.persona'

export const gateProvider: moo.def.gate.provider = {
  admin: admin,
  authenticated: authenticated,
  anonymous: anonymous,
  any: any__,
  moderator: moderator,
}
