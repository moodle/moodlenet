import { MoodleNet } from '../../../../..'
import { MutationResolvers } from '../../../../../graphql'
import { httpGqlServerRoutes } from '../../../http-gql-server.routes'

export const accountLogin: MutationResolvers['accountLogin'] = async (
  _parent,
  { password, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'Accounting.Session.Login',
    flow: httpGqlServerRoutes.flow('gql-request'),
    req: { password, username },
  })

  return res.___ERROR
    ? {
        message: res.___ERROR.msg,
        jwt: null,
      }
    : {
        jwt: res.jwt,
        message: null,
      }
}
