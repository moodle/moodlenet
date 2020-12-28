import { MoodleNet } from '../../../../..'
import { hashPassword } from '../../../UserAccount.helpers'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { loggedUserOnly } from '../../helpers'

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword: plainNewPawd },
  context
) => {
  const account = loggedUserOnly({ context })
  const newPassword = await hashPassword({ pwd: plainNewPawd })
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Change_Password',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { newPassword, username: account.username },
  })

  return {
    __typename: 'SimpleResponse',
    ...(res.___ERROR
      ? {
          success: false,
          message: res.___ERROR.msg,
        }
      : !res.success
      ? {
          message: res.reason,
          success: false,
        }
      : {
          success: true,
          message: null,
        }),
  }
}
