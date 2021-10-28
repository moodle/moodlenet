import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { getGraphOperators } from '../../adapters/content-graph/arangodb/adapters/bl/graphOperators'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { getGraphOperatorsAdapter } from './common'

export type TraverseFromNodeAdapterInput = {
  fromNode: BV<GraphNode | null>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  targetIds: Maybe<BV<GraphNode | null>[]>
  inverse: boolean
  page: PaginationInput
  issuerNode: BV<GraphNode | null>
}
export const traverseNodeRelationsAdapter = plug<(_: TraverseFromNodeAdapterInput) => Promise<NodeTraversalPage>>(
  ns(__dirname, 'traverse-node-relations-adapter'),
)

export type TraverseFromNodeInput = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  targetIds: Maybe<GraphNodeIdentifier[]>
  inverse: boolean
  page: PaginationInput
  sessionEnv: SessionEnv
}

export const traverseNodeRelations = plug(
  ns(__dirname, 'traverse-node-relations'),
  async ({ edgeType, sessionEnv, fromNode, inverse, page, targetIds, targetNodeType }: TraverseFromNodeInput) => {
    const { graphNode } = await getGraphOperatorsAdapter()
    const issuerNode = graphNode(sessionEnv.authId)

    return traverseNodeRelationsAdapter({
      issuerNode,
      edgeType,
      inverse,
      page,
      targetNodeType,
      fromNode: graphNode(fromNode),
      targetIds: targetIds?.map(graphNode),
    })
  },
)

//

export const countNodeRelationsAdapter = plug<(_: NodeRelationCountAdapterInput) => Promise<number>>(
  ns(__dirname, 'count-node-relations-adapter'),
)

export type NodeRelationCountAdapterInput = {
  fromNode: BV<GraphNode | null>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: boolean
  sessionEnv: SessionEnv
}
export type NodeRelationCountInput = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: boolean
  sessionEnv: SessionEnv
}

export const countNodeRelations = plug(ns(__dirname, 'count-node-relations'), async (input: NodeRelationCountInput) => {
  const { graphNode } = await getGraphOperators()
  return countNodeRelationsAdapter({ ...input, fromNode: graphNode(input.fromNode) })
})
