import { Routes, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { v4 as uuidV4 } from 'uuid'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { getConfig } from '../functions/getConfig'
import { newAccountRequest } from '../functions/newAccountRequest'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const RegisterNewAccountRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.RegisterNewAccount.Request'> => async ({
  email,
  flow,
}) => {
  const { publicBaseUrl } = getMNEnv()

  const config = await getConfig({ persistence })
  const { newAccountRequestEmail, newAccountVerificationWaitSecs } = config
  const token = uuidV4()

  const resp = await newAccountRequest({
    persistence,
    email,
    flow,
    token,
  })
  if (typeof resp === 'string') {
    return { success: false, reason: resp }
  } else {
    const emailObj = fillEmailTemplate({
      template: newAccountRequestEmail,
      to: email,
      vars: {
        email,
        link: `${publicBaseUrl}${webappPath<Routes.ActivateNewAccount>('/activate-new-account/:token', {
          token,
        })}`,
      },
    })
    enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })
    enqueue<MoodleNetArangoUserAccountSubDomain>()('UserAccount.RegisterNewAccount.DeleteRequest', flow, {
      delayDeliverSecs: newAccountVerificationWaitSecs,
    })({ token })

    return { success: true }
  }
}

export const signUp: MutationResolvers['signUp'] = async (_parent, { email }, context) => {
  const res = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.RegisterNewAccount.Request', context.flow)(
    {
      email,
      flow: context.flow,
    },
  )

  if (!res.success) {
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
