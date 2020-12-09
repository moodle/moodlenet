import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'

export const accountRequestConfirmEmail: MutationResolvers['accountRequestConfirmEmail'] = async (
  _parent,
  { token },
  context
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { token },
  })
  console.log(context)
  return res.___ERROR ? null : !res.success ? null : { flowKey: res.flow._key }
}
