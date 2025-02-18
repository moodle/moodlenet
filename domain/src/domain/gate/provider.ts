import { admin } from '../persona/admin.persona'
import { anonymous } from '../persona/anonymous.persona'
import { any__ } from '../persona/any.persona'
import { authenticated } from '../persona/authenticated.persona'

export const gateProvider: moo.gate.provider<{
  admin: admin
  authenticated: authenticated
  anonymous: anonymous
  any: any__
}> = {
  admin: admin,
  authenticated: authenticated,
  anonymous: anonymous,
  any: any__,
}
