import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
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

  return {
    __typename: 'SimpleResponse',
    ...(res.___ERROR
      ? {
          message: res.___ERROR.msg,
          success: false,
        }
      : res.success
      ? {
          message: null,
          success: true,
        }
      : {
          message: res.reason,
          success: false,
        }),
  }
}
