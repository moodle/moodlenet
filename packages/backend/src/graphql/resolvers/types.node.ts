import { Document } from 'arangojs/documents'
import { MoodleNetExecutionContext } from '../../adapters/executionContext/types'
import * as GQL from '../types.graphql.gen'
import { ShallowNode } from '../types.node'

const _rel: GQL.ResolverFn<
  GQL.ResolversTypes['RelPage'],
  Document<ShallowNode>,
  MoodleNetExecutionContext,
  GQL.RequireFields<GQL.INode_RelArgs, 'edge'>
> = async (_parent, _node, _ctx, _info) => {
  // const { _id: parentId } = parent
  // const {
  //   edge: {  type: edgeType, node: targetNodeType, inverse,  targetMe, targetIDs },
  //   // page,
  // } = node

  // const session = getSessionExecutionContext(ctx)
  // const isOnlyTargetingMe = targetMe && !targetIDs

  // if (isOnlyTargetingMe && !session) {
  return {
    __typename: 'RelPage',
    edges: [],
    pageInfo: { __typename: 'PageInfo', hasNextPage: false, hasPreviousPage: false },
  }
  // }

  // const executorProfileIDs = session ? [session.profileId] : []
  // const isTargetingIds = !!targetIDs || targetMe

  // const targetNodeIds = isTargetingIds ? executorProfileIDs.concat(targetIDs || []) : null

  // const pageResult = await call(traverse({
  //   edgeType,
  //   parentNodeId: parentId as ID,
  //   inverse: !!inverse,
  //   targetNodeType,
  //   page,
  //   targetNodeIds,
  //   ctx,
  // }))
}

type RelCount = {
  [e in GQL.EdgeType]?: {
    [dir in 'from' | 'to']: {
      [t in GQL.NodeType]?: number
    }
  }
}

type NodeDocumentWithRelCount = Document<ShallowNode> & { _relCount?: RelCount | null }
export const _relCount: GQL.ResolverFn<
  GQL.ResolversTypes['Int'],
  NodeDocumentWithRelCount,
  MoodleNetExecutionContext,
  GQL.RequireFields<GQL.INode_RelCountArgs, 'type' | 'target'>
> = async (parent, { target, type, inverse }, _ctx, _info) => {
  const count = parent?._relCount?.[type]?.[inverse ? 'from' : 'to']?.[target] ?? 0
  return Math.round(count)
}

export const NodeResolver = {
  _rel,
  _relCount,
  id: (parent: Document<ShallowNode>) => parent._id,
} as any
