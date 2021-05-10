import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { confirmUserEmailChangeRequest } from '../functions/confirmUserEmailChangeRequest'
import { getVerifiedUserByUsernameAndPassword } from '../functions/getVerifiedUserByUsernameAndPassword'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Persistence } from '../types'

export const ConfirmAndChangeUserEmailWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.ChangeMainEmail.ConfirmAndChangeUserEmail'> => async ({
  token,
  password,
  username,
}) => {
  const user = await getVerifiedUserByUsernameAndPassword({
    persistence,
    username,
    password,
  })

  if (!user) {
    return false
  }

  const confirmError = await confirmUserEmailChangeRequest({ token, persistence })
  if (confirmError) {
    return false
  }

  //TODO: emit UserEmailChangedEvent
  return true
}

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password, username },
  ctx,
) => {
  return call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.ChangeMainEmail.ConfirmAndChangeUserEmail', ctx.flow)({
    password,
    token,
    username,
  })
}
