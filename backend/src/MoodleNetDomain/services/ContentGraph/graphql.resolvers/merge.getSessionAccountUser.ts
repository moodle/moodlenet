import { getAuthUserId } from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import { NodeType, Resolvers } from '../ContentGraph.graphql.gen'
export const getSessionAccountUser: Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { username } /* , _ctx, _info */
) => {
  const { findNode } = await getContentGraphPersistence()
  const _id = getAuthUserId({ accountUsername: username })
  return {
    user: await findNode({ _id, nodeType: NodeType.User }),
  } as any
}
