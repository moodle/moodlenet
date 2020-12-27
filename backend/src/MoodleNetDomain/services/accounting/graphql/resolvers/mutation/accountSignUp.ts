import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountSignUp: MutationResolvers['accountSignUp'] = async (
  _parent,
  { email }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    flow: accountingRoutes.flow('accounting-graphql-request'),
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
