import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../../UserAccount.graphql.gen'
import { loggedUserOnly } from '../../helpers'

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (
  _parent,
  { newEmail },
  context
) => {
  const account = loggedUserOnly({ context })
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Change_Main_Email.Request',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { newEmail, username: account.username },
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
          success: true,
          message: null,
        }
      : {
          message: res.reason,
          success: false,
        }),
  }
}
