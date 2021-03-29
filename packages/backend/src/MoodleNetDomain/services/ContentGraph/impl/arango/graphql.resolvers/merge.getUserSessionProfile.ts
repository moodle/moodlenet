import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../lib/domain/amqp/call'
import { Profile, QueryResolvers } from '../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'
import { fakeUnshallowNodeForResolverReturnType } from './helpers'
export const getUserSessionProfile: QueryResolvers['getUserSessionProfile'] = async (
  _root,
  { profileId },
  ctx /*_info */,
) => {
  if (!profileId) {
    return {
      __typename: 'UserSession',
      profile: null,
    }
  }
  const { _key, nodeType } = parseNodeId(profileId)
  if (nodeType !== 'Profile') {
    return null
  }
  const shallowProfile = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
    _key,
    nodeType,
    ctx,
  })
  if (!shallowProfile) {
    throw new Error('Profile not found')
  }

  return {
    __typename: 'UserSession',
    profile: fakeUnshallowNodeForResolverReturnType<Profile>(shallowProfile),
  }
}
