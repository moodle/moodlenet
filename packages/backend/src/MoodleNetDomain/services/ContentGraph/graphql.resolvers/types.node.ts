import { isEdgeType, isId, isNodeType } from '@moodlenet/common/lib/utils/content-graph'
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
  const { _id: parentId, __typename: parentNodeType } = parent
  const {
    edge: { type: edgeType, node: targetNodeType, inverse },
    page,
  } = node
  const { traverseEdges } = await getContentGraphPersistence()
  if (!(isId(parentId) && isNodeType(parentNodeType) && isNodeType(targetNodeType) && isEdgeType(edgeType))) {
    // should never happen
    const errorMsg = `Id[${parentId}] or node type[parent:${parentNodeType} | target:${targetNodeType}] or edge type [${edgeType}] are not valid`
    console.error({
      node,
      parent,
      errorMsg,
    })
    throw new Error(errorMsg) //FIXME
  }

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
    parentNodeType,
    inverse: !!inverse,
    targetNodePolicy,
    targetNodeType,
    page,
  })
  return pageResult
}

export const NodeResolver = {
  _rel,
} as any
