import type { resetMyPassword as resetMyPasswordType } from '.'
import { requestLink } from './requestLink.core'
import { setNew } from './setNew.core'
export const resetMyPassword: moo.core.usecase<resetMyPasswordType> = {
  requestLink,
  setNew,
}
