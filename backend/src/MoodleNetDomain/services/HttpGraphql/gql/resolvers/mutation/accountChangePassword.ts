import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { hashPassword } from '../../../../Accounting/accounting.helpers'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'
import { loggedUserOnly } from '../../helpers'

export const accountChangePassword: MutationResolvers['accountChangePassword'] = async (
  _parent,
  { newPassword: plainNewPawd },
  ctx
) => {
  const jwt = loggedUserOnly({ ctx })
  const newPassword = await hashPassword({ pwd: plainNewPawd })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Password',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { newPassword, username: jwt.username },
  })

  return res.___ERROR
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
      }
}
