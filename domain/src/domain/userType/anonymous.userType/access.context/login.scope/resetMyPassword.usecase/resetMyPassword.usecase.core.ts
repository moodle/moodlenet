import { requestLink } from './requestLink.core'
import type { resetMyPassword as resetMyPassword_defe } from './resetMyPassword.usecase'
import { setNew } from './setNew.core'
export const resetMyPassword: moo.def.core.usecase<resetMyPassword_defe> = {
  requestLink,
  setNew,
}
