import { MoodleNet } from '../../../../..'
import { loggedUserOnly } from '../../../../../GQL'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountChangeEmailRequest: MutationResolvers['accountChangeEmailRequest'] = async (
  _parent,
  { newEmail },
  ctx
) => {
  const jwt = loggedUserOnly({ ctx })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Main_Email.Request',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { newEmail, username: jwt.username },
  })
  return {
    __typename:'SimpleResponse',
    ...res.___ERROR
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
}
