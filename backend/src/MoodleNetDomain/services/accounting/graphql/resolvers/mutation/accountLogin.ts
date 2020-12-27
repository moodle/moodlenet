import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountLogin: MutationResolvers['accountLogin'] = async (
  _parent,
  { password, username }
) =>
  // ctx
  {
    // console.log(ctx)
    const { res } = await MoodleNet.callApi({
      api: 'Accounting.Session.Login',
      flow: accountingRoutes.flow('accounting-graphql-request'),
      req: { password, username },
    })

    return {
      __typename: 'Session',
      ...(res.___ERROR
        ? {
            message: res.___ERROR.msg,
            jwt: null,
          }
        : {
            jwt: res.jwt,
            message: null,
          }),
    }
  }
