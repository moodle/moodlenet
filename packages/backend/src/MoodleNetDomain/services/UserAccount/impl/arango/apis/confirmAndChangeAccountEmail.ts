import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { confirmAccountEmailChangeRequest } from '../functions/confirmAccountEmailChangeRequest'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export const ConfirmAndChangeAccountEmailWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<
  MoodleNetArangoUserAccountSubDomain,
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
> => async ({ token, password, username }) => {
  const account = await getVerifiedAccountByUsernameAndPassword({
    persistence,
    username,
    password,
  })

  if (!account) {
    return false
  }

  const confirmError = await confirmAccountEmailChangeRequest({ token, persistence })
  if (confirmError) {
    return false
  }

  //TODO: emit AccountEmailChangedEvent
  return true
}

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password, username },
  ctx,
) => {
  return call<MoodleNetArangoUserAccountSubDomain>()(
    'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail',
    ctx.flow,
  )({
    password,
    token,
    username,
  })
}
