import { generateUlid } from '@moodle/lib-id-gen'
import { isLeft, right } from 'fp-ts/Either'
import { isNone } from 'fp-ts/Option'
import { isString } from 'lodash'
import { activeAuthSessionInfo } from '../model/accessControl.model'
import { domainCore } from '../persona'
import { admin } from '../persona/admin.persona/admin.persona.core'
import { anonymous } from '../persona/anonymous.persona/anonymous.persona.core'
import { any } from '../persona/any.persona/any.persona.core'
import { authenticated } from '../persona/authenticated.persona/authenticated.persona.core'
import { moderator } from '../persona/moderator.persona/moderator.persona.core'

export const domainCoreImpl: domainCore = {
  admin,
  anonymous,
  any,
  authenticated,
  moderator,
}

export const model: moo.model.impl = {
  accessControl: {
    getMyUserSessionInfo: {
      '* call': async ({ authSessionToken }, _) => {
        if (!isString(authSessionToken)) {
          return anonSessionInfo(_)
        }
        const e_authSessionData = await _.over(_.model.jwtTokens.xModel.accessControl.authSession.validate).call.query({ token: authSessionToken })
        if (isLeft(e_authSessionData)) {
          return anonSessionInfo(_)
        }
        const authSessionData = e_authSessionData.right.data
        const o_activeAuthSession = await _.over(_.model.accessControl.getAuthSession).call.query({ authSessionId: authSessionData.authSessionId })
        if (isNone(o_activeAuthSession)) {
          return anonSessionInfo(_)
        }
        const { activeAuthSessionInfo } = o_activeAuthSession.value
        return {
          info: {
            session: activeAuthSessionInfo.session,
            user: activeAuthSessionInfo.user,
          },
        }
      },
    },
    activateAuthSessionFor: {
      '* call': async ({ userId }, _) => {
        const e_session_obj = await _.over(_.model.accessControl.getUserSessionFor).call.query({
          userId,
        })
        if (isLeft(e_session_obj)) {
          return e_session_obj
        }

        const { session } = e_session_obj.right

        const authSessionId = generateUlid({ onDate: new Date() })
        const { token: authSessionToken } = await _.over(_.model.jwtTokens.xModel.accessControl.authSession.sign).call.query({ data: { userId, authSessionId } }) // as signed_token

        const activeAuthSessionInfo: activeAuthSessionInfo = {
          session,
          user: { type: 'auth', id: userId },
          authSessionToken,
        }

        await _.over(_.model.accessControl.storeAuthSessionInfo).call.query({ authSessionId, activeAuthSessionInfo })

        return right({ activeAuthSessionInfo })
      },
    },
  },
}

async function anonSessionInfo(_: moo.model.handle): Promise<{ info: moo.session.info }> {
  const user: moo.session.info.user = { type: 'anon' }
  const { session: anonSession } = await _.over(_.model.accessControl.getAnonUserSession).call.query()
  return {
    info: {
      user,
      session: anonSession,
    },
  }
}
