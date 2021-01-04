import { MoodleNet } from '../../../..'
import { MutationResolvers } from '../../UserAccount.graphql.gen'
import { userAccountRoutes } from '../../UserAccount.routes'

export const sessionByEmail: MutationResolvers['sessionByEmail'] = async (
  _parent,
  { email, username }
) => {
  const { res } = await MoodleNet.callApi({
    api: 'UserAccount.Session.By_Email',
    flow: userAccountRoutes.flow('UserAccount-GraphQL-Request'),
    req: { email, username },
  })
  if (res.___ERROR) {
    return {
      __typename: 'SimpleResponse',
      message: res.___ERROR.msg,
      success: false,
    }
  } else if (!res.success) {
    return {
      __typename: 'SimpleResponse',
      message: res.reason,
      success: false,
    }
  } else {
    return { __typename: 'SimpleResponse', message: null, success: true }
  }
}
