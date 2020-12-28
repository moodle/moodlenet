import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { flowKey, password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Register_New_Account.ActivateNewAccount',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { password, requestFlowKey: flowKey, username },
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
          success: true,
          message: null,
        }
      : {
          message: res.reason,
          success: false,
        }),
  }
}
