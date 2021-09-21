import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type TraverseNodeRelAdapter = {
  traverseNodeRelations: (_: TraverseFromNodeInput) => Promise<NodeTraversalPage>
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
    async ({ traverseNodeRelations }: TraverseNodeRelAdapter) => {
      return traverseNodeRelations(input)
    },
)

//

export type NodeRelationCountAdapter = {
  countNodeRelations: (_: NodeRelationCountInput) => Promise<number>
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
    async ({ countNodeRelations }: NodeRelationCountAdapter) => {
      return countNodeRelations(input)
    },
)

QMModule(module)
