import { MoodleNet } from '../../..'
import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import { graphQLRequestApiCaller } from '../../../MoodleNetGraphQL'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { userAccountRoutes } from '../UserAccount.routes'
import {
  getSimpleResponse,
  userAndJwtByActiveUserAccount,
  fillEmailTemplate,
} from '../UserAccount.helpers'

export type SessionByEmailApi = Api<
  { email: string; username: string },
  { success: true } | { success: false; reason: string }
>

export const SessionByEmailApiHandler = async () => {
  const {
    getConfig,
    getActiveAccountByUsername,
  } = await getAccountPersistence()
  const handler: RespondApiHandler<SessionByEmailApi> = async ({
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
    const { jwt } = await userAndJwtByActiveUserAccount({
      activeUserAccount: account,
    })

    const emailObj = fillEmailTemplate({
      template: resetAccountPasswordRequestEmail,
      to: account.email,
      vars: { username, link: `https://xxx.xxx/temp-session/${jwt}` },
    })

    await MoodleNet.callApi({
      api: 'Email.SendOne.SendNow',
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
    api: 'UserAccount.Session.ByEmail',
    req: { email, username },
  })

  if (res.___ERROR) {
    return getSimpleResponse({
      message: res.___ERROR.msg,
    })
  } else if (!res.success) {
    return getSimpleResponse({
      message: res.reason,
    })
  } else {
    return getSimpleResponse({ success: true })
  }
}
