import { Id } from '@moodlenet/common/lib/utils/content-graph'
import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { Resolvers, User } from '../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getSessionAccountUser: Resolvers['Query']['getSessionAccountUser'] = async (
  _root,
  { userId },
  ctx /*_info */,
) => {
  const { node: shallowUser } = await api<MoodleNetDomain>(ctx.flow)('ContentGraph.Node.ById').call(
    nodeById => nodeById<User>({ _id: userId as Id }), // BEWARE: manual cast of Id
  )

  if (!shallowUser) {
    throw new Error('User not found')
  }
  return {
    __typename: 'UserSession',
    user: fakeUnshallowNodeForResolverReturnType(shallowUser),
  }
}
