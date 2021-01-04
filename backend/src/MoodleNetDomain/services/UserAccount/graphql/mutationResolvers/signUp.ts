import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const signUp: MutationResolvers['signUp'] = async (
  _parent,
  { email }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Register_New_Account.Request',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { email },
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
      message: null,
      success: true,
    }
  }
}
