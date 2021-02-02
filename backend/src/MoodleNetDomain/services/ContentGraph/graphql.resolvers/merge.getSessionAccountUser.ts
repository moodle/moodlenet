import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { getAuthUserId } from '../../../MoodleNetGraphQL'
import { Resolvers, User } from '../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getSessionAccountUser: Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { username },
  ctx /*_info */
) => {
  const _id = getAuthUserId({ accountUsername: username })
  const { node: shallowUser } = await api<MoodleNetDomain>(ctx.flow)(
    'ContentGraph.Node.ById'
  ).call((nodeById) => nodeById<User>({ _id }))

  if (!shallowUser) {
    throw new Error('User not found')
  }
  return {
    __typename: 'UserSession',
    user: fakeUnshallowNodeForResolverReturnType(shallowUser),
  }
}
