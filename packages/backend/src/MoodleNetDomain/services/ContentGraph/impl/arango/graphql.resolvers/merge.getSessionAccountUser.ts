import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
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
  const { _key, nodeType } = parseNodeId(userId)
  if (nodeType !== NodeType.User) {
    return null
  }
  const shallowUser = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
    _key,
    nodeType,
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
