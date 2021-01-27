import { Context } from '../../../MoodleNetGraphQL'
import { ShallowNode } from '../persistence/types'
import * as GQL from '../ContentGraph.graphql.gen'
import { getContentGraphPersistence } from '../ContentGraph.env'
import {
  getStaticFilteredEdgeBasicAccessPolicy,
  getStaticFilteredNodeBasicAccessPolicy,
  isEdgeType,
  isId,
  isNodeType,
} from '../graphDefinition/helpers'

const _rel: GQL.ResolverFn<
  GQL.ResolversTypes['Page'],
  ShallowNode,
  Context,
  GQL.RequireFields<GQL.INode_RelArgs, 'edge'>
> = async (
  { _id: parentId, __typename: parentNodeType },
  { edge: { type: edgeType, node: targetNodeType, rev }, page },
  ctx,
  _info
) => {
  const { traverseEdges } = await getContentGraphPersistence()
  if (
    !(
      isId(parentId) &&
      isNodeType(parentNodeType) &&
      isNodeType(targetNodeType) &&
      isEdgeType(edgeType)
    )
  ) {
    // should never happen
    throw new Error(
      `Id[${parentId}] or node type[${parentNodeType} | ${targetNodeType}] or edge type [${edgeType}] are not valid`
    ) //FIXME
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
    throw new Error(
      `${
        ctx.auth?.role || 'Anonymous'
      } are not allowed to query ${edgeType}->${targetNodeType}`
    ) //FIXME
  }

  const pageResult = await traverseEdges({
    ctx,
    edgePolicy,
    edgeType,
    parentId,
    parentNodeType,
    rev: !!rev,
    targetNodePolicy,
    targetNodeType,
    page,
  })
  return pageResult
}

export const NodeResolver = {
  _rel,
} as any
