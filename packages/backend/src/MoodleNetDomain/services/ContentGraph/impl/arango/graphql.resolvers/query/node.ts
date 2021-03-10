import { call } from '../../../../../../../lib/domain/amqp/call'
import { MoodleNetDomain } from '../../../../../../MoodleNetDomain'
import * as GQL from '../../../../ContentGraph.graphql.gen'
import { fakeUnshallowNodeForResolverReturnType } from '../helpers'

export const node: GQL.QueryResolvers['node'] = async (_root, { _id }, ctx /* ,_info */) => {
  const maybeNode = await call<MoodleNetDomain>()('ContentGraph.Node.ById', ctx.flow)({ _id, ctx })

  console.log(`maybeNode`, maybeNode)
  return maybeNode && fakeUnshallowNodeForResolverReturnType(maybeNode)
}
