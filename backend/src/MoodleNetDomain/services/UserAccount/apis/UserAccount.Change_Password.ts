import { RespondApiHandler } from '../../../../lib/domain'
import { Api } from '../../../../lib/domain/api/types'
import {
  graphQLRequestApiCaller,
  loggedUserOnly,
} from '../../../MoodleNetGraphQL'
import { Messages } from '../persistence/types'
import { getAccountPersistence } from '../UserAccount.env'
import { MutationResolvers } from '../UserAccount.graphql.gen'
import {
  getVerifiedAccountByUsername,
  hashPassword,
} from '../UserAccount.helpers'

export type ChangePasswordPersistence = (_: {
  currentPassword: string
  newPassword: string
  accountId: string
}) => Promise<null | Messages.NotFound>

export type Change_Password_Api = Api<
  { username: string; currentPassword: string; newPassword: string },
  { success: true } | { success: false; reason: string }
>

export const Change_Password_Api_Handler = async () => {
  const { changePassword } = await getAccountPersistence()
  const handler: RespondApiHandler<Change_Password_Api> = async ({
    req: { newPassword, username, currentPassword },
  }) => {
    const account = await getVerifiedAccountByUsername({
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
      return { success: true } as const
    }
  }
  return handler
}

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword, currentPassword },
  context
) => {
  const {
    sessionAccount: { username },
  } = loggedUserOnly({ context })

  const { res } = await graphQLRequestApiCaller({
    api: 'UserAccount.Change_Password',
    req: {
      newPassword,
      currentPassword,
      username,
    },
  })

  if (res.___ERROR) {
    return {
      __typename: 'SimpleResponse',
      success: false,
      message: res.___ERROR.msg,
    }
  } else if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  } else {
    return {
      __typename: 'SimpleResponse',
      success: true,
      message: null,
    }
  }
}
