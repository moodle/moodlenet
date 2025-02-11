import { signed_token } from '@moodle/lib-types'
import { requestLink, requestLink_Gate } from './requestLink.endpoint'
import { setNew, setNew_Gate } from './setNew.endpoint'

export type resetMyPassword = moo.persona.usecase<{
  requestLink: requestLink
  setNew: setNew
  [moo.persona.usecase.modelTypes]: {
    mailer: {
      resetPasswordLink: {
        displayName: string
        resetPasswordToken: signed_token
      }
    }
    jwtTokens: {
      resetPasswordToken: {
        userId: string
      }
    }
  }
}>

export const resetMyPassword_Gate: moo.gate.usecase<resetMyPassword> = {
  requestLink: requestLink_Gate,
  setNew: setNew_Gate,
}
