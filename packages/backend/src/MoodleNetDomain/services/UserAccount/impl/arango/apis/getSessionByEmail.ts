import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/Email.helpers'
import { userAndJwtByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { ArangoUserAccountSubDomain } from '../ArangoUserAccountDomain'
import { DBReady, UserAccountDB } from '../env'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'
import { getConfig } from '../functions/getConfig'

export type T = WrkTypes<ArangoUserAccountSubDomain, 'UserAccount.Session.ByEmail'>

export const SessionByEmailWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [SessionByEmailWorker({ db })]
}
export const SessionByEmailWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ email, username, ctx }) => {
    const { publicBaseUrl } = getMNEnv()
    const config = await getConfig({ db })
    const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
    const account = await getActiveAccountByUsername({ db, username })

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

    enqueue<MoodleNetDomain>()('Email.SendOne.SendNow', ctx.flow)({ emailObj, flow: ctx.flow })

    return { success: true }
  }
  return worker
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (_parent, { email, username }, context) => {
  const res = await call<ArangoUserAccountSubDomain>()('UserAccount.Session.ByEmail', context.flow)({
    ctx: context,
    email,
    flow: context.flow, //FIXME: has already flow in context
    username,
  })
  return {
    __typename: 'SimpleResponse',
    success: res.success,
    message: res.success ? null : res.reason,
  }
}
