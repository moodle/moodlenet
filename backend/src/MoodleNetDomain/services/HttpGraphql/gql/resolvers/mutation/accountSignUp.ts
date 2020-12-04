import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'

export const accountSignUp: MutationResolvers['accountSignUp'] = async (_parent, { email }) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    flow: httpGqlServerRoutes.flow('gql-request'),
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
