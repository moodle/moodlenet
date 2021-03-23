import { call } from '../../../../../../lib/domain/amqp/call'
import { getSessionExecutionContext, MoodleNetExecutionContext } from '../../../../../types'
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
    edge: { type: edgeType, node: targetNodeType, inverse, targetMe },
    page,
  } = node
  const session = getSessionExecutionContext(ctx)
  if (targetMe && !session) {
    return {
      __typename: 'RelPage',
      edges: [],
      pageInfo: { __typename: 'PageInfo', hasNextPage: false, hasPreviousPage: false },
    }
  }
  const pageResult = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.Edge.Traverse', ctx.flow)({
    edgeType,
    parentNodeId: parentId,
    inverse: !!inverse,
    targetNodeType,
    page,
    targetNodeIds: targetMe && session ? [session.profileId] : null,
  })
  return pageResult
}

export const NodeResolver = {
  _rel,
} as any
