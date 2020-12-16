import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountLogin: MutationResolvers['accountLogin'] = async (
  _parent,
  { password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Session.Login',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { password, username },
  })

  return res.___ERROR
    ? {
        message: res.___ERROR.msg,
        jwt: null,
      }
    : {
        jwt: res.jwt,
        message: null,
      }
}
