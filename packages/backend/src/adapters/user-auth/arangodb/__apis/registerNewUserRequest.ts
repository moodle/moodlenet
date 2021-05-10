import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { v4 as uuidV4 } from 'uuid'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { getConfig } from '../functions/getConfig'
import { newUserRequest } from '../functions/newUserRequest'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const RegisterNewUserRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.RegisterNewUser.Request'> => async ({ email, flow }) => {
  const { publicBaseUrl } = getMNEnv()

  const config = await getConfig({ persistence })
  const { newUserRequestEmail, newUserVerificationWaitSecs } = config
  const token = uuidV4()

  const resp = await newUserRequest({
    persistence,
    email,
    flow,
    token,
  })
  if (typeof resp === 'string') {
    return { success: false, reason: resp }
  }

  const emailObj = fillEmailTemplate({
    template: newUserRequestEmail,
    to: email,
    vars: {
      email,
      link: `${publicBaseUrl}${webappPath<Routes.ActivateNewUser>('/activate-new-user/:token', {
        token,
      })}`,
    },
  })
  enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })
  enqueue<MoodleNetArangoUserAuthSubDomain>()('UserAuth.RegisterNewUser.DeleteRequest', flow, {
    delayDeliverSecs: newUserVerificationWaitSecs,
  })({ token })

  return { success: true }
}

export const signUp: MutationResolvers['signUp'] = async (_parent, { email }, context) => {
  const res = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.RegisterNewUser.Request', context.flow)({
    email,
    flow: context.flow,
  })

  if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  }

  return {
    __typename: 'SimpleResponse',
    message: null,
    success: true,
  }
}
