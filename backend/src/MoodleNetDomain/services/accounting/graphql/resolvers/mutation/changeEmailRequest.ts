import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'
import { loggedUserOnly } from '../../helpers'

export const changeEmailRequest: MutationResolvers['changeEmailRequest'] = async (
  _parent,
  { newEmail },
  context
) => {
  const account = loggedUserOnly({ context })
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Change_Main_Email.Request',
    flow: accountingRoutes.flow('accounting-graphql-request'),
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
