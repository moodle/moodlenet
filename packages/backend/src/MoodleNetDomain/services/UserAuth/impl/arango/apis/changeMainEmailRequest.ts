import { Routes, webappPath } from '@moodlenet/common/src/webapp/sitemap'
import { v4 as uuidV4 } from 'uuid'
import { call } from '../../../../../../lib/domain/amqp/call'
import { enqueue } from '../../../../../../lib/domain/amqp/enqueue'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { getMNEnv } from '../../../../../MoodleNet.env'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { throwLoggedUserOnly } from '../../../../../MoodleNetGraphQL'
import { fillEmailTemplate } from '../../../../Email/helpers'
import { getSimpleResponse } from '../../../helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { changeUserEmailRequest } from '../functions/changeUserEmailRequest'
import { getConfig } from '../functions/getConfig'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence, UserStatus } from '../types'

export const ChangeUserEmailRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.ChangeMainEmail.Request'> => async ({
  flow,
  userId,
  newEmail,
}) => {
  const { publicBaseUrl } = getMNEnv()
  const token = uuidV4()
  const mUserOrError = await changeUserEmailRequest({
    persistence,
    userId,
    flow,
    newEmail,
    token,
  })

  if (typeof mUserOrError === 'object' && mUserOrError.status === UserStatus.Active) {
    const { username } = mUserOrError
    const { changeUserEmailRequestEmail, changeUserEmailVerificationWaitSecs } = await getConfig({
      persistence,
    })
    const emailObj = fillEmailTemplate({
      template: changeUserEmailRequestEmail,
      to: newEmail,
      vars: {
        username,
        link: `${publicBaseUrl}${webappPath<Routes.ActivateNewUser>('/activate-new-user/:token', { token })}`,
      },
    })

    enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })

    enqueue<MoodleNetArangoUserAuthSubDomain>()('UserAuth.ChangeMainEmail.DeleteRequest', flow, {
      delayDeliverSecs: changeUserEmailVerificationWaitSecs,
    })({ token })

    return { success: true }
  }

  const reason = typeof mUserOrError === 'string' ? mUserOrError : 'not found'
  return { success: false, reason }
}

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (_parent, { newEmail }, context) => {
  const { userId } = throwLoggedUserOnly({ context })

  const res = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.ChangeMainEmail.Request', context.flow)({
    newEmail,
    userId,
    flow: context.flow,
  })

  if (!res.success) {
    return getSimpleResponse({ message: res.reason })
  }
  return getSimpleResponse({ success: true })
}
