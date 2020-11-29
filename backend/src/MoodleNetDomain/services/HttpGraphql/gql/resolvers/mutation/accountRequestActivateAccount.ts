import { MutationResolvers } from '../../types'
import { MoodleNet } from '../../../../..'
import { newFlow } from '../../../../../../lib/domain/helpers'

export const accountRequestActivateAccount: MutationResolvers['accountRequestActivateAccount'] = async (
  _parent,
  { flowKey, password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.ActivateNewAccount',
    flow: newFlow(),
    req: { password, requestFlowKey: flowKey, username },
  })
  return res.___ERROR
    ? {
        __typename: 'SimpleResponse',
        message: res.___ERROR.msg,
        success: false,
      }
    : res.success
    ? {
        __typename: 'SimpleResponse',
        success: true,
        message: null,
      }
    : {
        __typename: 'SimpleResponse',
        message: res.reason,
        success: false,
      }
}
