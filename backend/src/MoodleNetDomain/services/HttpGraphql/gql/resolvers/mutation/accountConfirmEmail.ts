import { MutationResolvers } from '../../types'
import { MoodleNet } from '../../../../..'
import { newFlow } from '../../../../../../lib/domain/helpers'

export const accountConfirmEmail: MutationResolvers['accountConfirmEmail'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: newFlow(),
    req: { token },
  })
  return res.___ERROR
    ? {
        __typename: 'SimpleResponse',
        message: res.___ERROR.msg,
        success: false,
      }
    : {
        __typename: 'SimpleResponse',
        message: res.success ? null : res.error,
        success: res.success,
      }
}
