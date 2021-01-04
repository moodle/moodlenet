import { MoodleNet } from '../../../..'
import { loggedUserOnly } from '../../../../MoodleNetGraphQL'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { userAccountRoutes } from '../../UserAccount.routes'

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword, currentPassword },
  context
) => {
  const {
    sessionAccount: { username },
  } = loggedUserOnly({ context })

  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Change_Password',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
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
