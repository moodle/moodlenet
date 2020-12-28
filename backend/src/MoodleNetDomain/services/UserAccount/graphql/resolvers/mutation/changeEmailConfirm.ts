import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { token },
  })
  return res.___ERROR ? false : !res.success ? false : true
}
