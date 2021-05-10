import { call } from '../../../../../../lib/domain/amqp/call'
import { LookupWorker } from '../../../../../../lib/domain/wrk'
import { throwLoggedUserOnly } from '../../../../../MoodleNetGraphQL'
import { hashPassword } from '../../../helpers'
import { MutationResolvers } from '../../../UserAuth.graphql.gen'
import { changeUserPassword } from '../functions/changePassword'
import { getVerifiedUserByUsernameAndPassword } from '../functions/getVerifiedUserByUsernameAndPassword'
import { MoodleNetArangoUserAuthSubDomain } from '../MoodleNetArangoUserAuthSubDomain'
import { Messages, Persistence } from '../types'

export const ChangePasswordWorker = ({
  persistence,
}: {
  persistence: Persistence
}): LookupWorker<MoodleNetArangoUserAuthSubDomain, 'UserAuth.ChangePassword'> => async ({
  newPassword,
  username,
  currentPassword,
}) => {
  const user = await getVerifiedUserByUsernameAndPassword({
    persistence,
    username,
    password: currentPassword,
  })

  if (!user) {
    return Messages.NotFound
  }

  const currentPasswordHash = await hashPassword({ pwd: currentPassword })
  const newPasswordHash = await hashPassword({ pwd: newPassword })

  return changeUserPassword({
    persistence,
    userId: user._id,
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
  const result = await call<MoodleNetArangoUserAuthSubDomain>()('UserAuth.ChangePassword', context.flow)({
    currentPassword,
    newPassword,
    username,
  })

  if (result !== null) {
    return { __typename: 'SimpleResponse', success: false, message: 'not found or wrong password' }
  }

  return { __typename: 'SimpleResponse', success: true, message: null }
}
