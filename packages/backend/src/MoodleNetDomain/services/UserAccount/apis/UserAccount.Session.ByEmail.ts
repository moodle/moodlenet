import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { api } from '../../../../lib/domain'
import { Flow } from '../../../../lib/domain/types/path'
import { getMNEnv } from '../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { fillEmailTemplate, getSimpleResponse, userAndJwtByActiveUserAccount } from '../UserAccount.helpers'
import { userAccountRoutes } from '../UserAccount.routes'

export type SessionByEmailApiReq = {
  email: string
  username: string
  flow: Flow
  ctx: MoodleNetExecutionContext
}
export type SessionByEmailApiRes = { success: true } | { success: false; reason: string }

export const SessionByEmailApiHandler = async ({ email, username, flow, ctx }: SessionByEmailApiReq) => {
  const { publicBaseUrl } = getMNEnv()
  const { getConfig, getActiveAccountByUsername } = await getAccountPersistence()
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
    ctx,
  })

  const emailObj = fillEmailTemplate({
    template: resetAccountPasswordRequestEmail,
    to: account.email,
    vars: {
      username,
      link: `${publicBaseUrl}${webappPath<Routes.ActivateNewAccount>('/activate-new-account/:token', {
        token: jwt,
      })}`,
    },
  })

  await api<MoodleNetDomain>(userAccountRoutes.setRoute(flow, 'Temp-Email-Session'))(
    'Email.SendOne.SendNow',
  ).enqueue((sendOne, flow) => sendOne({ emailObj, flow }))
  return { success: true }
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (_parent, { email, username }, ctx) => {
  const res = await api<MoodleNetDomain>(ctx.flow)('UserAccount.Session.ByEmail').call((sessionByEmail, flow) =>
    sessionByEmail({ email, username, flow, ctx }),
  )

  if (!res.success) {
    return getSimpleResponse({
      message: res.reason,
    })
  } else {
    return getSimpleResponse({ success: true })
  }
}
