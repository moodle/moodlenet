import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import { getContentGraphPersistence } from '../ContentGraph.env'
import * as GQL from '../ContentGraph.graphql.gen'
import {
  getStaticFilteredEdgeBasicAccessPolicy,
  getStaticFilteredNodeBasicAccessPolicy,
} from '../graphDefinition/helpers'
import { ShallowNode } from '../persistence/types'

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
  const { traverseEdges } = await getContentGraphPersistence()
  const targetNodePolicy = getStaticFilteredNodeBasicAccessPolicy({
    accessType: 'read',
    nodeType: targetNodeType,
    ctx,
  })
  const edgePolicy = getStaticFilteredEdgeBasicAccessPolicy({
    accessType: 'read',
    edgeType,
    ctx,
  })
  if (!(targetNodePolicy && edgePolicy)) {
    // probably not allowed (may want to split in policy lookups in 2 steps, to check if found and then if auth applies )
    throw new Error(`${ctx.auth?.role || 'Anonymous'} are not allowed to query ${edgeType}->${targetNodeType}`) //FIXME
  }

  const pageResult = await traverseEdges({
    ctx,
    edgePolicy,
    edgeType,
    parentNodeId: parentId,
    inverse: !!inverse,
    targetNodePolicy,
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
