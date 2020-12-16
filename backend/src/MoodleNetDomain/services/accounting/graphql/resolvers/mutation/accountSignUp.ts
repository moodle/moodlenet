import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountSignUp: MutationResolvers['accountSignUp'] = async (_parent, { email }) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { email },
  })

  return res.___ERROR
    ? {
        __typename: 'SimpleResponse',
        message: res.___ERROR.msg,
        success: false,
      }
    : res.success
    ? {
        __typename: 'SimpleResponse',
        message: null,
        success: true,
      }
    : {
        __typename: 'SimpleResponse',
        message: res.reason,
        success: false,
      }
}
