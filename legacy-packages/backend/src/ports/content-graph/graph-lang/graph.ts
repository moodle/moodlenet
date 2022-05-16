import { GraphEdge, GraphEdgeIdentifier, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { ns } from '../../../lib/ns/namespace'
import { value } from '../../../lib/plug'
import { BV } from './base'

export type GraphOperators = {
  graphNode<Type extends GraphNodeType = GraphNodeType>(nodeId: null | GraphNodeIdentifier<Type>): BV<GraphNode<Type>>
  graphEdge<Type extends GraphEdgeType = GraphEdgeType>(edgeId: null | GraphEdgeIdentifier<Type>): BV<GraphEdge<Type>>
  isCreator(_: { authNode: BV<GraphNode>; ofGlyph: BV<GraphNode | GraphEdge | null> }): BV<boolean>
  creatorOf(_: BV<GraphNode | GraphEdge>): BV<GraphNode | null>
  isPublished(node: BV<GraphNode | null>): BV<boolean>
  isSameNode(a: BV<GraphNode>, b: BV<GraphNode>): BV<boolean>
}
export const graphOperators = value<GraphOperators>(ns(module, 'graph-operators'))
