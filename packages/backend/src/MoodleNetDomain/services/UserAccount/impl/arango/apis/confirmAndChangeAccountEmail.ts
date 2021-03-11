import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { DBReady, UserAccountDB } from '../env'
import { confirmAccountEmailChangeRequest } from '../functions/confirmAccountEmailChangeRequest'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'

export type T = WrkTypes<
  MoodleNetArangoUserAccountSubDomain,
  'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'
>

export const ConfirmAndChangeAccountEmailWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ token, password, username }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({
      db,
      username,
      password,
    })

    if (!account) {
      return false
    }

    const confirmError = await confirmAccountEmailChangeRequest({ token, db })
    if (confirmError) {
      return false
    }

    //TODO: emit AccountEmailChangedEvent
    return true
  }
  return worker
}

export const ConfirmAndChangeAccountEmailWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [ConfirmAndChangeAccountEmailWorker({ db })]
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
