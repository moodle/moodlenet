import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'
import { loggedUserOnly } from '../../helpers'

export const accountChangeEmailRequest: MutationResolvers['accountChangeEmailRequest'] = async (
  _parent,
  { newEmail },
  ctx
) => {
  const jwt = loggedUserOnly({ ctx })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Main_Email.Request',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { newEmail, username: jwt.user },
  })
  return res.___ERROR
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
      }
}
