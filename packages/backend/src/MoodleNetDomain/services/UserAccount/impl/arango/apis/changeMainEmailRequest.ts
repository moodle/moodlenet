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
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { changeAccountEmailRequest } from '../functions/changeAccountEmailRequest'
import { getConfig } from '../functions/getConfig'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence, UserAccountStatus } from '../types'

export const ChangeAccountEmailRequestWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.ChangeMainEmail.Request'> => async ({
  flow,
  accountId,
  newEmail,
}) => {
  const { publicBaseUrl } = getMNEnv()
  const token = uuidV4()
  const mAccountOrError = await changeAccountEmailRequest({
    persistence,
    accountId,
    flow,
    newEmail,
    token,
  })

  if (typeof mAccountOrError === 'object' && mAccountOrError.status === UserAccountStatus.Active) {
    const { username } = mAccountOrError
    const { changeAccountEmailRequestEmail, changeAccountEmailVerificationWaitSecs } = await getConfig({
      persistence,
    })
    const emailObj = fillEmailTemplate({
      template: changeAccountEmailRequestEmail,
      to: newEmail,
      vars: {
        username,
        link: `${publicBaseUrl}${webappPath<Routes.ActivateNewAccount>('/activate-new-account/:token', { token })}`,
      },
    })

    enqueue<MoodleNetDomain>()('Email.SendOne', flow)({ emailObj, flow })

    enqueue<MoodleNetArangoUserAccountSubDomain>()('UserAccount.ChangeMainEmail.DeleteRequest', flow, {
      delayDeliverSecs: changeAccountEmailVerificationWaitSecs,
    })({ token })

    return { success: true }
  }

  const reason = typeof mAccountOrError === 'string' ? mAccountOrError : 'not found'
  return { success: false, reason }
}

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (_parent, { newEmail }, context) => {
  const { accountId } = throwLoggedUserOnly({ context })

  const res = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.ChangeMainEmail.Request', context.flow)({
    newEmail,
    accountId,
    flow: context.flow,
  })

  if (!res.success) {
    return getSimpleResponse({ message: res.reason })
  }
  return getSimpleResponse({ success: true })
}
