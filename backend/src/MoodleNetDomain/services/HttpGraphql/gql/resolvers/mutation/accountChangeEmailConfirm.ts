import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'

export const accountChangeEmailConfirm: MutationResolvers['accountChangeEmailConfirm'] = async (
  _parent,
  { token }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Email.Verify_Email.Confirm_Email',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { token },
  })
  return res.___ERROR ? false : !res.success ? false : true
}
