import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { loggedUserOnly } from '../../../../MoodleNetGraphQL'

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (
  _parent,
  { newEmail },
  context
) => {
  const {
    sessionAccount: { accountId },
  } = loggedUserOnly({ context })

  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Change_Main_Email.Request',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { newEmail, accountId },
  })

  if (res.___ERROR) {
    return {
      __typename: 'SimpleResponse',
      message: res.___ERROR.msg,
      success: false,
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
