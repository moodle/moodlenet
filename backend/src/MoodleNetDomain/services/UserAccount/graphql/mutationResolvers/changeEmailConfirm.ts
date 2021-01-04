import { MoodleNet } from '../../../..'
import { userAccountRoutes } from '../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const changeEmailConfirm: MutationResolvers['changeEmailConfirm'] = async (
  _parent,
  { token, password }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Change_Main_Email.Confirm_And_Change_Account_Email',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { password, token },
  })
  return res.___ERROR ? false : res.done
}
