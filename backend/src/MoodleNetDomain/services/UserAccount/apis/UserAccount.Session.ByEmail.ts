import { MoodleNet } from '../../..'
import { Flow } from '../../../../lib/domain/types/path'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import {
  fillEmailTemplate,
  getSimpleResponse,
  userAndJwtByActiveUserAccount,
} from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

export type SessionByEmailApiReq = {
  email: string
  username: string
  flow: Flow
}
export type SessionByEmailApiRes =
  | { success: true }
  | { success: false; reason: string }

export const SessionByEmailApiHandler = async ({
  email,
  username,
  flow,
}: SessionByEmailApiReq) => {
  const {
    getConfig,
    getActiveAccountByUsername,
  } = await getAccountPersistence()
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

  await MoodleNet.api('Email.SendOne.SendNow').enqueue(
    (sendOne, flow) => sendOne({ emailObj, flow }),
    userAccountRoutes.setRoute(flow, 'Temp-Email-Session')
  )
  return { success: true }
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (
  _parent,
  { email, username },
  context
) => {
  const res = await MoodleNet.api('UserAccount.Session.ByEmail').call(
    (sessionByEmail, flow) => sessionByEmail({ email, username, flow }),
    context.flow
  )

  if (!res.success) {
    return getSimpleResponse({
      message: res.reason,
    })
  } else {
    return getSimpleResponse({ success: true })
  }
}
