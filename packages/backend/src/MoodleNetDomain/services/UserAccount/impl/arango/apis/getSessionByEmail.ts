import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { userAndJwtByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'
import { getConfig } from '../functions/getConfig'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.ByEmail'>

export const SessionByEmailWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ email, username, ctx }) => {
    const { publicBaseUrl } = getMNEnv()
    const config = await getConfig({ persistence })
    const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
    const account = await getActiveAccountByUsername({ persistence, username })

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

    enqueue<MoodleNetDomain>()('Email.SendOne', ctx.flow)({ emailObj, flow: ctx.flow })

    return { success: true }
  }
  return worker
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (_parent, { email, username }, context) => {
  const res = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.Session.ByEmail', context.flow)({
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
