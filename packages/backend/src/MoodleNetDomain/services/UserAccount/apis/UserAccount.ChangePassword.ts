import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { loggedUserOnly } from '../../../MoodleNetGraphQL'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import { getSimpleResponse, getVerifiedAccountByUsernameAndPassword, hashPassword } from '../UserAccount.helpers'

export type ChangePasswordPersistence = (_: {
  currentPassword: string
  newPassword: string
  accountId: string
}) => Promise<null | Messages.NotFound>

export type ChangePasswordApiReq = {
  username: string
  currentPassword: string
  newPassword: string
}
export type ChangePasswordApiRes = { success: true } | { success: false; reason: string }

export const ChangePasswordApiHandler = async ({
  newPassword,
  username,
  currentPassword,
}: ChangePasswordApiReq): Promise<ChangePasswordApiRes> => {
  const { changePassword } = await getAccountPersistence()
  const account = await getVerifiedAccountByUsernameAndPassword({
    username,
    password: currentPassword,
  })

  if (!account) {
    return { success: false, reason: 'not found or wrong password' }
  }

  const currentPasswordHash = await hashPassword({ pwd: currentPassword })
  const newPasswordHash = await hashPassword({ pwd: newPassword })

  const changePwdError = await changePassword({
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

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword, currentPassword },
  context,
) => {
  const { username } = loggedUserOnly({ context })

  const res = await api<MoodleNetDomain>(context.flow)('UserAccount.ChangePassword').call(changePassword =>
    changePassword({
      newPassword,
      currentPassword,
      username,
    }),
  )

  if (!res.success) {
    return getSimpleResponse({ message: res.reason })
  } else {
    return getSimpleResponse({ success: true })
  }
}
