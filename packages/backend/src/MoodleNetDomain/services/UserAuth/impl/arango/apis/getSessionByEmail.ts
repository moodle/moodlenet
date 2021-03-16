import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { createSessionByActiveUser } from '../../../helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { getActiveUserByUsername } from '../functions/getActiveUserByUsername'
import { getConfig } from '../functions/getConfig'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const SessionByEmailWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.Session.ByEmail'> => async ({ email, username, flow }) => {
  const { publicBaseUrl } = getMNEnv()
  const config = await getConfig({ persistence })
  const { tempSessionEmail: resetUserPasswordRequestEmail } = config
  const user = await getActiveUserByUsername({ persistence, username })

  if (!user || user.email !== email) {
    return { success: false, reason: 'not found' }
  }
  const { jwt } = await createSessionByActiveUser({ activeUser: user })

  const emailObj = fillEmailTemplate({
    template: resetUserPasswordRequestEmail,
    to: user.email,
    vars: {
      username,
      link: `${publicBaseUrl}${webappPath<Routes.ActivateNewUser>('/activate-new-user/:token', {
        token: jwt,
      })}`,
    },
  })

  enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })

  return { success: true }
}

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (_parent, { email, username }, context) => {
  const res = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.Session.ByEmail', context.flow)({
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
