import { MoodleNet } from '../../../../..'
import { accountingRoutes } from '../../../Accounting.routes'
import { MutationResolvers } from '../../accounting.graphql.gen'

export const accountRequestConfirmEmail: MutationResolvers['accountRequestConfirmEmail'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: accountingRoutes.flow('accounting-graphql-request'),
    req: { token },
  })
  return res.___ERROR ? null : !res.success ? null : { flowKey: res.flow._key }
}
