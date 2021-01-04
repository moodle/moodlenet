import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { password, username, token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Register_New_Account.Confirm_Email_Activate_Account',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { password, token, username },
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
      success: false,
      message: res.reason,
    }
  } else {
    return {
      __typename: 'SimpleResponse',
      success: true,
      message: null,
    }
  }
}
