import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { confirmAccountEmailChangeRequest } from '../functions/confirmAccountEmailChangeRequest'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Persistence } from '../types'

export type T = WrkTypes<
  MoodleNetArangoUserAccountSubDomain,
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
>

export const ConfirmAndChangeAccountEmailWorker = ({ persistence }: { persistence: Persistence }) => {
  const worker: T['Worker'] = async ({ token, password, username }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({
      persistence,
      username,
      password,
    })

    if (!account) {
      return false
    }

    const confirmError = await confirmAccountEmailChangeRequest({ token, db: persistence })
    if (confirmError) {
      return false
    }

    //TODO: emit AccountEmailChangedEvent
    return true
  }
  return worker
}

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password, username },
  ctx,
) => {
  return call<MoodleNetArangoUserAccountSubDomain>()<T['Api']>(
    'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail',
    ctx.flow,
  )({
    password,
    token,
    username,
  })
}
