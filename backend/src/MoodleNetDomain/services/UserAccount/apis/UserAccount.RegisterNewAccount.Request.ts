import { MutationResolvers } from '../UserAccount.graphql.gen'
import { v4 as uuidV4 } from 'uuid'
import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { Flow } from '../../../../lib/domain/types/path'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'

export type NewAccountRequestPersistence = (_: {
  email: string
  token: string
  flow: Flow
}) => Promise<null | Messages.EmailNotAvailable>

export type RegisterNewAccountRequestApi = Api<
  { email: string },
  { success: true } | { success: false; reason: string }
>

export const RegisterNewAccountRequestApiHandler = async () => {
  const { getConfig, newAccountRequest } = await getAccountPersistence()

  const handler: RespondApiHandler<RegisterNewAccountRequestApi> = async ({
    flow,
    req: { email },
  }) => {
    const config = await getConfig()
    const { newAccountRequestEmail, newAccountVerificationWaitSecs } = config
    const token = uuidV4()

    const resp = await newAccountRequest({
      email,
      flow,
      token,
    })
    if (typeof resp === 'string') {
      return { success: false, reason: resp } as const
    } else {
      const emailObj = fillEmailTemplate({
        template: newAccountRequestEmail,
        to: email,
        vars: {
          email,
          link: `https://xxx.xxx/new-account-confirm/${token}`,
        },
      })
      await Promise.all([
        MoodleNet.callApi({
          api: 'Email.SendOne.SendNow',
          flow: userAccountRoutes.setRoute(flow, 'Register-New-Account'),
          req: { emailObj },
          opts: { justEnqueue: true },
        }),
        MoodleNet.callApi({
          api: 'UserAccount.RegisterNewAccount.DeleteRequest',
          flow,
          req: { token },
          opts: {
            delaySecs: newAccountVerificationWaitSecs,
            justEnqueue: true,
          },
        }),
      ])
      return { success: true } as const
    }
  }

  return handler
}

export const signUp: MutationResolvers['signUp'] = async (
  _parent,
  { email }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.RegisterNewAccount.Request',
    req: { email },
  })
  if (res.___ERROR) {
    return {
      __typename: 'SimpleResponse',
      message: res.___ERROR.msg,
      success: false,
    }
  } else if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  } else {
    return {
      __typename: 'SimpleResponse',
      message: null,
      success: true,
    }
  }
}
