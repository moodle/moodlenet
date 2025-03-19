import { requestLink } from './requestLink.endpoint'
import { setNew } from './setNew.endpoint'

export type resetMyPassword = moo.def.userType.usecase<{
  requestLink: requestLink
  setNew: setNew
}>

export const resetMyPassword: moo.def.gate.provider.usecase<resetMyPassword> = {
  requestLink,
  setNew,
}
