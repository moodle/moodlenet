import { BV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { GraphOperators } from '@moodlenet/common/lib/content-graph/bl/graph-lang/graphOperators'
import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '@moodlenet/common/lib/types'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type TraverseNodeRelAdapter = {
  traverseNodeRelations: (_: TraverseFromNodeAdapterInput) => Promise<NodeTraversalPage>
  graphOperators: GraphOperators
}

export type TraverseFromNodeAdapterInput = {
  fromNode: BV<GraphNode | null>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  targetIds: Maybe<BV<GraphNode | null>[]>
  inverse: boolean
  page: PaginationInput
  env: SessionEnv | null
}
export type TraverseFromNodeInput = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  targetIds: Maybe<GraphNodeIdentifier[]>
  inverse: boolean
  page: PaginationInput
  env: SessionEnv | null
}

export const fromNode = QMQuery(
  (input: TraverseFromNodeInput) =>
    async ({ traverseNodeRelations, graphOperators: { graphNode } }: TraverseNodeRelAdapter) => {
      return traverseNodeRelations({
        ...input,
        fromNode: graphNode(input.fromNode),
        targetIds: input.targetIds?.map(graphNode),
      })
    },
)

//

export type NodeRelationCountAdapter = {
  countNodeRelations: (_: NodeRelationCountAdapterInput) => Promise<number>
  graphOperators: GraphOperators
}

export type NodeRelationCountAdapterInput = {
  fromNode: BV<GraphNode | null>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: boolean
  env: SessionEnv | null
}
export type NodeRelationCountInput = {
  fromNode: GraphNodeIdentifier
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: boolean
  env: SessionEnv | null
}
export const count = QMQuery(
  (input: NodeRelationCountInput) =>
    async ({ countNodeRelations, graphOperators: { graphNode } }: NodeRelationCountAdapter) => {
      return countNodeRelations({ ...input, fromNode: graphNode(input.fromNode) })
    },
)

QMModule(module)
