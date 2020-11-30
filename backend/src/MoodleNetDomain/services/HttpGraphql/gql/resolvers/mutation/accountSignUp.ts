import { MoodleNet } from '../../../../..'
import { newFlow } from '../../../../../../lib/domain/helpers'
import { MutationResolvers } from '../../../../../graphql'

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
    : res.success
    ? {
        __typename: 'SimpleResponse',
        message: null,
        success: true,
      }
    : {
        __typename: 'SimpleResponse',
        message: res.reason,
        success: false,
      }
}
