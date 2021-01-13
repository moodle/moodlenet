import { MoodleNet } from '../../../..'
import { contentGraphRoutes } from '../../ContentGraph.routes'
import { MutationResolvers } from '../../ContentGraph.graphql.gen'
import { loggedUserOnly } from '../../../../MoodleNetGraphQL'

export const followUser: MutationResolvers['followUser'] = async (
  _parent,
  { userId: followed },
  context
) => {
  const {
    sessionAccount: { username },
  } = loggedUserOnly({ context })
  const follower = `User/${username}`
  const { res } = await MoodleNet.callApi({
    api: 'ContentGraph.Follows.Create_User_Follows_User',
    flow: contentGraphRoutes.flow('ContentGraph-GraphQL-Request'),
    req: { followed, follower },
  })
  if (res.___ERROR) {
    return null
  } else {
    return res
  }
}
