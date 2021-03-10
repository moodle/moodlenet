import { call } from '../../../../../../lib/domain/amqp/call'
import { WrkTypes } from '../../../../../../lib/domain/wrk'
import { throwLoggedUserOnly } from '../../../../../MoodleNetGraphQL'
import { getSimpleResponse, hashPassword } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { ArangoUserAccountSubDomain } from '../ArangoUserAccountDomain'
import { DBReady, UserAccountDB } from '../env'
import { changeAccountPassword } from '../functions/changePassword'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { Messages } from '../types'

export type ChangePasswordPersistence = (_: {
  currentPassword: string
  newPassword: string
  accountId: string
}) => Promise<null | Messages.NotFound>

export type T = WrkTypes<ArangoUserAccountSubDomain, 'UserAccount.ChangePassword'>

export const ChangePasswordApiWorker = ({ db }: { db: UserAccountDB }) => {
  const worker: T['Worker'] = async ({ newPassword, username, currentPassword }) => {
    const account = await getVerifiedAccountByUsernameAndPassword({
      db,
      username,
      password: currentPassword,
    })

    if (!account) {
      return { success: false, reason: 'not found or wrong password' }
    }

    const currentPasswordHash = await hashPassword({ pwd: currentPassword })
    const newPasswordHash = await hashPassword({ pwd: newPassword })

    const changePwdError = await changeAccountPassword({
      db,
      accountId: account._id,
      currentPassword: currentPasswordHash,
      newPassword: newPasswordHash,
    })
    if (changePwdError) {
      return { success: false, reason: changePwdError }
    } else {
      return { success: true }
    }
  }
  return worker
}

export const ChangePasswordApiWrkInit: T['Init'] = async () => {
  const db = await DBReady
  return [ChangePasswordApiWorker({ db })]
}

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword, currentPassword },
  context,
) => {
  const { username } = throwLoggedUserOnly({ context })

  const res = await call<ArangoUserAccountSubDomain>()('UserAccount.ChangePassword', context.flow)({
    newPassword,
    currentPassword,
    username,
  })

  if (!res.success) {
    return getSimpleResponse({ message: res.reason })
  } else {
    return getSimpleResponse({ success: true })
  }
}
