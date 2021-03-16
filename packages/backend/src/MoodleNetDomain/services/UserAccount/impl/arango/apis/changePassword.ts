import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { throwLoggedUserOnly } from '../../../../../MoodleNetGraphQL'
import { hashPassword } from '../../../helpers'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { changeAccountPassword } from '../functions/changePassword'
import { getVerifiedAccountByUsernameAndPassword } from '../functions/getVerifiedAccountByUsernameAndPassword'
import { MoodleNetArangoUserAccountSubDomain } from '../MoodleNetArangoUserAccountSubDomain'
import { Messages, Persistence } from '../types'

export const ChangePasswordWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAccountSubDomain, 'UserAccount.ChangePassword'> => async ({
  newPassword,
  username,
  currentPassword,
}) => {
  const account = await getVerifiedAccountByUsernameAndPassword({
    persistence,
    username,
    password: currentPassword,
  })

  if (!account) {
    return Messages.NotFound
  }

  const currentPasswordHash = await hashPassword({ pwd: currentPassword })
  const newPasswordHash = await hashPassword({ pwd: newPassword })

  return changeAccountPassword({
    persistence,
    accountId: account._id,
    currentPassword: currentPasswordHash,
    newPassword: newPasswordHash,
  })
}

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { currentPassword, newPassword },
  context,
) => {
  const { username } = throwLoggedUserOnly({ context })
  const result = await call<MoodleNetArangoUserAccountSubDomain>()('UserAccount.ChangePassword', context.flow)({
    currentPassword,
    newPassword,
    username,
  })

  if (result !== null) {
    return { __typename: 'SimpleResponse', success: false, message: 'not found or wrong password' }
  }

  return { __typename: 'SimpleResponse', success: true, message: null }
}
