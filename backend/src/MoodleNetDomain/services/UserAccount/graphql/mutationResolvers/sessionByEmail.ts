import { MoodleNet } from '../../../..'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { userAccountRoutes } from '../../UserAccount.routes'

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Session.By_Email',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { email, username },
  })

  return res.___ERROR ? res.___ERROR.msg : null
}
