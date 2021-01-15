import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { getAccountPersistence } from '../UserAccount.env'
import { fillEmailTemplate, signJwt } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'

export type Session_By_Email_Api = Api<
  { email: string; username: string },
  { success: true } | { success: false; reason: string }
>

export const Session_By_Email_Api_Handler = async () => {
  const {
    getConfig,
    getActiveAccountByUsername,
  } = await getAccountPersistence()
  const handler: RespondApiHandler<Session_By_Email_Api> = async ({
    flow,
    req: { email, username },
  }) => {
    const config = await getConfig()
    const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
    const account = await getActiveAccountByUsername({
      username,
    })
    if (!account || account.email !== email) {
      return { success: false, reason: 'not found' }
    }
    const jwt = await signJwt({ account })
    const emailObj = fillEmailTemplate({
      template: resetAccountPasswordRequestEmail,
      to: account.email,
      vars: { username, link: `https://xxx.xxx/temp-session/${jwt}` },
    })
    await MoodleNet.callApi({
      api: 'Email.Send_One.Send_Now',
      flow: userAccountRoutes.setRoute(flow, 'Temp-Email-Session'),
      req: {
        emailObj,
      },
      opts: { justEnqueue: true },
    })
    return { success: true } as const
  }
  return handler
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.Session.By_Email',
    req: { email, username },
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
    return { __typename: 'SimpleResponse', message: null, success: true }
  }
}
