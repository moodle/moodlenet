import { GraphEdge, GraphEdgeByType, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNode, GraphNodeByType, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { DistOmit } from '@moodlenet/common/lib/utils/types'
import { Document, Edge } from 'arangojs/documents'
import { VersionedDB } from '../../../lib/helpers/arango/migrate/types'

export type ContentGraphDB = VersionedDB<'0.0.1'>

export type AqlGraphEdge<E extends GraphEdge = GraphEdge> = Edge<DistOmit<E, 'id' | '_type'>> & {
  _fromType: string
  _toType: string
}
export type AqlGraphNode<N extends GraphNode = GraphNode> = Document<DistOmit<N, '_permId'>>

export type AqlGraphEdgeByType<T extends GraphEdgeType> = AqlGraphEdge<GraphEdgeByType<T>>
export type AqlGraphNodeByType<T extends GraphNodeType> = AqlGraphNode<GraphNodeByType<T>>
