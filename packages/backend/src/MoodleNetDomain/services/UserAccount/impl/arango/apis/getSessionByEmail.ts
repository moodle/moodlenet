import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { createSessionByActiveUserAccount } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { getActiveAccountByUsername } from '../functions/getActiveAccountByUsername'
import { getConfig } from '../functions/getConfig'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const SessionByEmailWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.Session.ByEmail'> => async ({
  email,
  username,
  flow,
}) => {
  const { publicBaseUrl } = getMNEnv()
  const config = await getConfig({ persistence })
  const { tempSessionEmail: resetAccountPasswordRequestEmail } = config
  const account = await getActiveAccountByUsername({ persistence, username })

  if (!account || account.email !== email) {
    return { success: false, reason: 'not found' }
  }
  const { jwt } = await createSessionByActiveUserAccount({ activeUserAccount: account })

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

  enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })

  return { success: true }
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (_parent, { email, username }, context) => {
  const res = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.Session.ByEmail', context.flow)({
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
