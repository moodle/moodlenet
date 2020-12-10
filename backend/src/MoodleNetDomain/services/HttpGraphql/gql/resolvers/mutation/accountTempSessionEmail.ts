import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'

export const accountTempSessionEmail: MutationResolvers['accountTempSessionEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Temp_Email_Session',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { email, username },
  })

  return res.___ERROR ? res.___ERROR.msg : null
}
