import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph'
import { call } from '../../../../../../../lib/domain/amqp/call'
import * as GQL from '../../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'
import { fakeUnshallowNodeForResolverReturnType } from '../helpers'

export const node: GQL.QueryResolvers['node'] = async (_root, { _id }, ctx /* ,_info */) => {
  const { nodeType, _key } = parseNodeId(_id)
  const maybeNode = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({
    _key,
    nodeType,
    ctx,
  })
  return maybeNode && fakeUnshallowNodeForResolverReturnType(maybeNode)
}
