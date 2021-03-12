// import {
//   getStaticFilteredEdgeBasicAccessPolicy,
//   getStaticFilteredNodeBasicAccessPolicy,
// } from '../graphDefinition/helpers'
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
    ctx,
    edgeType,
    parentNodeId: parentId,
    inverse: !!inverse,
    targetNodeType,
    page,
    sort,
  })
  return pageResult
}

// const _relCount: GQL.ResolverFn<
//   GQL.ResolversTypes['Int'],
//   ShallowNode,
//   MoodleNetExecutionContext,
//   GQL.RequireFields<GQL.INode_RelCountArgs, 'edge'>
// > = async (parent, { edge: { inverse, node, type } }, ctx, _info) => {
//   const { getRelationCount } = await getContentGraphPersistence()
//   return getRelationCount({ ctx, nodeId: parent._id, edgeType: type, inverse: !!inverse, targetNodeType: node })
// }

export const NodeResolver = {
  _rel,
  //  _relCount,
} as any
