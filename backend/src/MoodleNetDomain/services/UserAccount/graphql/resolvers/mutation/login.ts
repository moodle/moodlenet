import { MoodleNet } from '../../../../..'
import { userAccountRoutes } from '../../../UserAccount.routes'
import { MutationResolvers } from '../../UserAccount.graphql.gen'

export const login: MutationResolvers['login'] = async (
  _parent,
  { password, username }
) =>
  // ctx
  {
    // console.log(ctx)
    const { res } = await MoodleNet.callApi({
      api: 'UserAccount.Session.Login',
      flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
      req: { password, username },
    })

    return {
      __typename: 'Session',
      ...(res.___ERROR
        ? {
            message: res.___ERROR.msg,
            jwt: null,
          }
        : {
            jwt: res.jwt,
            message: null,
          }),
    }
  }
