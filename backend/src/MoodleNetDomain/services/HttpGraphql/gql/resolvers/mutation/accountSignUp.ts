import { MutationResolvers } from '../../types'
import { MoodleNet } from '../../../../..'
import { newFlow } from '../../../../../../lib/domain/helpers'

export const accountSignUp: MutationResolvers['accountSignUp'] = async (_parent, { email }) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Register_New_Account.Request',
    flow: newFlow(),
    req: { email },
  })

  return res.___ERROR
    ? {
        __typename: 'SimpleResponse',
        message: res.___ERROR.msg,
        success: false,
      }
    : {
        __typename: 'SimpleResponse',
        message: null,
        success: true,
      }
}
