import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type TraverseNodeRelAdapter = {
  traverseNodeRelations: (_: TraverseFromNodeInput) => Promise<NodeTraversalPage>
}

export type TraverseFromNodeInput = {
  fromNode: Pick<GraphNode, '_slug' | '_type'>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: boolean
  page: PaginationInput
  env: SessionEnv | null
}

export const fromNode = QMQuery(
  (input: TraverseFromNodeInput) =>
    async ({ traverseNodeRelations }: TraverseNodeRelAdapter) => {
      return traverseNodeRelations(input)
    },
)

//

export type NodeRelationCountAdapter = {
  countNodeRelations: (_: NodeRelationCountInput) => Promise<number>
}

export type NodeRelationCountInput = {
  fromNode: Pick<GraphNode, '_slug' | '_type'>
  edgeType: GraphEdgeType
  targetNodeType: GraphNodeType
  inverse: Boolean
  env: SessionEnv | null
}
export const count = QMQuery(
  (input: NodeRelationCountInput) =>
    async ({ countNodeRelations: traverseNodeRelations }: NodeRelationCountAdapter) => {
      return traverseNodeRelations(input)
    },
)

QMModule(module)
