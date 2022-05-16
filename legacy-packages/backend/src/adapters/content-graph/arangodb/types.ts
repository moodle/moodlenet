import { GraphEdge, GraphEdgeType } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeType } from '@moodlenet/common/dist/content-graph/types/node'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { Document, Edge } from 'arangojs/documents'
import { VersionedDB } from '../../../lib/helpers/arango/migrate/types'

export type ContentGraphDB = VersionedDB<'2.0.1'>

export type AqlGraphEdge<E extends GraphEdge = GraphEdge> = Edge<DistOmit<E, 'id' | '_type'>> & {
  _fromType: string
  _toType: string
}
export type AqlGraphNode<N extends GraphNode = GraphNode> = Document<DistOmit<N, '_permId'>>

export type AqlGraphEdgeByType<T extends GraphEdgeType> = AqlGraphEdge<GraphEdge<T>>
export type AqlGraphNodeByType<T extends GraphNodeType> = AqlGraphNode<GraphNode<T>>
