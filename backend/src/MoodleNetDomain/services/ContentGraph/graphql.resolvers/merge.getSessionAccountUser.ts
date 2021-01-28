import {
  getAuthUserId,
  graphQLRequestApiCaller,
} from '../../../MoodleNetGraphQL'
import { Resolvers, User } from '../ContentGraph.graphql.gen'
export const getSessionAccountUser: Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { username } /* , _ctx, _info */
) => {
  const _id = getAuthUserId({ accountUsername: username })
  const { res } = await graphQLRequestApiCaller({
    api: 'ContentGraph.Node.ById',
    req: { _id },
  })
  if (res.___ERROR || !res.node) {
    throw new Error(res.___ERROR?.msg || 'User not found')
  }
  const { node } = res
  return {
    __typename: 'UserSession',
    user: node as User,
  }
}
