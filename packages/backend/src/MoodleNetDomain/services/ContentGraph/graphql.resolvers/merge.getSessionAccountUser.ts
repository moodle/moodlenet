import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { QueryResolvers, User } from '../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getSessionAccountUser: QueryResolvers['getSessionAccountUser'] = async (
  _root,
  { userId },
  ctx /*_info */,
) => {
  const { node: shallowUser } = await api<MoodleNetDomain>(ctx.flow)('ContentGraph.Node.ById').call(
    nodeById => nodeById<User>({ _id: userId, ctx }), // BEWARE: manual cast of Id
  )

  if (!shallowUser) {
    throw new Error('User not found')
  }
  return {
    __typename: 'UserSession',
    user: fakeUnshallowNodeForResolverReturnType(shallowUser),
  }
}
