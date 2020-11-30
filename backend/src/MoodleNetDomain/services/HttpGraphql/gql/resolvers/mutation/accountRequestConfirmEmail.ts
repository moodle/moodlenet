import { MoodleNet } from '../../../../..'
import { newFlow } from '../../../../../../lib/domain/helpers'
import { MutationResolvers } from '../../../../../graphql'

export const accountRequestConfirmEmail: MutationResolvers['accountRequestConfirmEmail'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: newFlow(),
    req: { token },
  })
  return res.___ERROR ? null : !res.success ? null : { flowKey: res.flow._key }
}
