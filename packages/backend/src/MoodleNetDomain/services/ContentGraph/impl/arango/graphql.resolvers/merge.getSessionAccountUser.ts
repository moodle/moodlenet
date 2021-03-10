import { call } from '../../../../../../lib/domain/amqp/call'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'
import { QueryResolvers, User } from '../../../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getSessionAccountUser: QueryResolvers['getSessionAccountUser'] = async (
  _root,
  { userId },
  ctx /*_info */,
) => {
  const shallowUser = await call<MoodleNetDomain>()('ContentGraph.Node.ById', ctx.flow)<User>({
    _id: userId,
    ctx,
  })
  if (!shallowUser) {
    throw new Error('User not found')
  }
  return {
    __typename: 'UserSession',
    user: fakeUnshallowNodeForResolverReturnType(shallowUser),
  }
}
