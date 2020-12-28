import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { userAccountRoutes } from '../../../UserAccount.routes'

export const tempSessionByEmail: MutationResolvers['tempSessionByEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Temp_Email_Session',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { email, username },
  })

  return res.___ERROR ? res.___ERROR.msg : null
}
