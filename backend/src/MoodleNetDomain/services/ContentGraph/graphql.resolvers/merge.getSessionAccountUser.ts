import { MoodleNet } from '../../..'
import { getAuthUserId } from '../../../MoodleNetGraphQL'
import { Resolvers, User } from '../ContentGraph.graphql.gen'
import { unshallowForResolver } from './helpers'
export const getSessionAccountUser: Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { username },
  ctx /*_info */
) => {
  const _id = getAuthUserId({ accountUsername: username })
  const { node: shallowUser } = await MoodleNet.api(
    'ContentGraph.Node.ById'
  ).call(
    (nodeById) => nodeById<User>({ _id }),
    ctx.flow
  )

  if (!shallowUser) {
    throw new Error('User not found')
  }
  return {
    __typename: 'UserSession',
    user: unshallowForResolver(shallowUser),
  }
}
