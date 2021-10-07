import { BV } from '.'
import { GraphEdge, GraphEdgeIdentifier, GraphEdgeType } from '../../types/edge'
import { GraphNode, GraphNodeIdentifier, GraphNodeType } from '../../types/node'

export type GraphOperators = {
  // edgeType(edgeType: GraphEdgeType): BV<GraphEdgeType>
  // nodeType(nodeType: GraphNodeType): BV<GraphNodeType>
  graphNode<Type extends GraphNodeType = GraphNodeType>(nodeId: GraphNodeIdentifier<Type>): BV<GraphNode<Type> | null>
  graphEdge<Type extends GraphEdgeType = GraphEdgeType>(edgeId: GraphEdgeIdentifier<Type>): BV<GraphEdge<Type> | null>

  isCreator(_: { authNode: BV<GraphNode | null>; ofNode: BV<GraphNode | null> }): BV<boolean>
  // nodeId(nodeId: GraphNodeIdentifier): BV<GraphNode| null>
  // authId(authId: AuthId, type: GraphNodeType): BV<AuthId>
}
