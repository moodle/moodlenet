import { call } from '../../../../../../../lib/domain/amqp/call'
import * as GQL from '../../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'
import { fakeUnshallowNodeForResolverReturnType } from '../helpers'

export const node: GQL.QueryResolvers['node'] = async (_root, { _id }, ctx /* ,_info */) => {
  const maybeNode = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Node.ById', ctx.flow)({ _id, ctx })
  return maybeNode && fakeUnshallowNodeForResolverReturnType(maybeNode)
}
