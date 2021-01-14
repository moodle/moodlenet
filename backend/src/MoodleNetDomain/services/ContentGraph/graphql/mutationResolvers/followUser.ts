import { MoodleNet } from '../../../..'
import { contentGraphRoutes } from '../../ContentGraph.routes'
import { MutationResolvers } from '../../ContentGraph.graphql.gen'
import { getUserId, loggedUserOnly } from '../../../../MoodleNetGraphQL'
import { GraphQLError } from 'graphql'

export const followUser: MutationResolvers['followUser'] = async (
  _parent,
  { userId: followed },
  context
) => {
  const auth = loggedUserOnly({ context })
  const follower = getUserId(auth)
  const { res } = await MoodleNet.callApi({
    api: 'ContentGraph.Follows.Create_User_Follows_User',
    flow: contentGraphRoutes.flow('ContentGraph-GraphQL-Request'),
    req: { followed, follower },
  })
  if (res.___ERROR) {
    throw new GraphQLError(res.___ERROR.msg)
  } else if (typeof res.edge === 'string') {
    throw new GraphQLError(res.edge)
  } else {
    return res.edge
  }
}
