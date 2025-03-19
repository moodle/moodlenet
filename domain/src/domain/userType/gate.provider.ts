import { anonymous } from '../userType/anonymous.userType/anonymous.userType'
import { any__ } from '../userType/any.userType/any.userType'

export const gateProvider: moo.def.gate.provider<moo.UserTypes> = {
  any: any__,
  anonymous,
}
