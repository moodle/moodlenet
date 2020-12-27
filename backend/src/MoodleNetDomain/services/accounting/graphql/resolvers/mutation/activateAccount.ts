import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const activateAccount: MutationResolvers['activateAccount'] = async (
  _parent,
  { flowKey, password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.ActivateNewAccount',
    flow: accountingRoutes.flow('accounting-graphql-request'),
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
