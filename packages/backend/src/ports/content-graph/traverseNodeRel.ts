import { GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeType, Slug } from '@moodlenet/common/lib/content-graph/types/node'
import { NodeTraversalPage, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { SessionEnv } from '../../lib/auth/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export type TraverseNodeRelAdapter = {
  traverseNodeRelations: <GNT extends GraphNodeType, GET extends GraphEdgeType>(
    _: TraverseFromNodeInput<GNT, GET>,
  ) => Promise<NodeTraversalPage>
}

export type TraverseFromNodeInput<GNT extends GraphNodeType, GET extends GraphEdgeType> = {
  fromNode: Pick<GraphNode, '_slug' | '_type'>
  edgeType: GET
  targetNodeType: GNT
  inverse: boolean
  page: PaginationInput
  env: SessionEnv | null
}

export const fromNode = QMQuery(
  <GNT extends GraphNodeType, GET extends GraphEdgeType>(input: TraverseFromNodeInput<GNT, GET>) =>
    async ({ traverseNodeRelations }: TraverseNodeRelAdapter) => {
      return traverseNodeRelations(input)
    },
)

//

export type NodeRelationCountAdapter = {
  traverseNodeRelations: <GNT extends GraphNodeType, GET extends GraphEdgeType>(
    _: NodeRelationCountInput<GNT, GET>,
  ) => Promise<number>
}

export type NodeRelationCountInput<GNT extends GraphNodeType, GET extends GraphEdgeType> = {
  fromNode: { slug: Slug; type: GraphNodeType }
  edgeType: GET
  targetNodeType: GNT
  inverse: Boolean
  env: SessionEnv | null
}
export const count = QMQuery(
  <GNT extends GraphNodeType, GET extends GraphEdgeType>(input: NodeRelationCountInput<GNT, GET>) =>
    async ({ traverseNodeRelations }: NodeRelationCountAdapter) => {
      return traverseNodeRelations(input)
    },
)

QMModule(module)
