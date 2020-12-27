import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../accounting.graphql.gen'
import { accountingRoutes } from '../../../Accounting.routes'

export const tempSessionByEmail: MutationResolvers['tempSessionByEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Temp_Email_Session',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { email, username },
  })

  return res.___ERROR ? res.___ERROR.msg : null
}
