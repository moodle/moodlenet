import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../accounting.graphql.gen'
import { hashPassword } from '../../../Accounting.helpers'
import { accountingRoutes } from '../../../Accounting.routes'
import { loggedUserOnly } from '../../../../../GQL'

export const accountChangePassword: MutationResolvers['accountChangePassword'] = async (
  _parent,
  { newPassword: plainNewPawd },
  ctx
) => {
  const jwt = loggedUserOnly({ ctx })
  const newPassword = await hashPassword({ pwd: plainNewPawd })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Password',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { newPassword, username: jwt.username },
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
