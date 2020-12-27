import { MoodleNet } from '../../../../..'
import { hashPassword } from '../../../Accounting.helpers'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'
import { loggedUserOnly } from '../../helpers'

export const changePassword: MutationResolvers['changePassword'] = async (
  _parent,
  { newPassword: plainNewPawd },
  context
) => {
  const account = loggedUserOnly({ context })
  const newPassword = await hashPassword({ pwd: plainNewPawd })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Password',
    flow: accountingRoutes.flow('accounting-graphql-request'),
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
