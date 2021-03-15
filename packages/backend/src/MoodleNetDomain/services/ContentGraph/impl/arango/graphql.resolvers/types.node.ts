import { call } from '../../../../../../lib/domain/amqp/call'
import { MoodleNetExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { ShallowNode } from '../../../types.node'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'

const _rel: GQL.ResolverFn<
  GQL.ResolversTypes['RelPage'],
  ShallowNode,
  MoodleNetExecutionContext,
  GQL.RequireFields<GQL.INode_RelArgs, 'edge'>
> = async (parent, node, ctx, _info) => {
  const { _id: parentId } = parent
  const {
    edge: { type: edgeType, node: targetNodeType, inverse },
    page,
    sort,
  } = node
  const pageResult = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Edge.Traverse', ctx.flow)({
    edgeType,
    parentNodeId: parentId,
    inverse: !!inverse,
    targetNodeType,
    page,
    sort,
  })
  return pageResult
}

export const NodeResolver = {
  _rel,
} as any
