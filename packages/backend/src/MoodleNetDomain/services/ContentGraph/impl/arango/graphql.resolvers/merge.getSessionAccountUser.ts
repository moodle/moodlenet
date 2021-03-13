import { call } from '../../../../../../lib/domain/amqp/call'
import { NodeType, QueryResolvers, User } from '../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getSessionAccountUser: QueryResolvers['getSessionAccountUser'] = async (
  _root,
  { userId },
  ctx /*_info */,
) => {
  if (!userId) {
    return {
      __typename: 'UserSession',
      user: null,
    }
  }
  const shallowUser = await call<MoodleNetArangoContentGraphSubDomain>()(
    'ContentGraph.Node.ById',
    ctx.flow,
  )<NodeType.User>({
    _id: userId,
    ctx,
  })
  if (!shallowUser) {
    throw new Error('User not found')
  }

  return {
    __typename: 'UserSession',
    user: fakeUnshallowNodeForResolverReturnType<User>(shallowUser),
  }
}
