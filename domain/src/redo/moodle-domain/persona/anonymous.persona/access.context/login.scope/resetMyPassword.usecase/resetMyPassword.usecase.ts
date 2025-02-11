import { signed_token } from '@moodle/lib-types'
import { requestLink } from './requestLink.endpoint'
import { setNew, setNew_Gate } from './setNew.endpoint'
declare module '..' {
  interface Scope {
    resetMyPassword: resetMyPassword
  }
}

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

export const resetMyPassword: moo.gate.usecase<resetMyPassword> = {
  requestLink: requestLink,
  setNew: setNew_Gate,
}
