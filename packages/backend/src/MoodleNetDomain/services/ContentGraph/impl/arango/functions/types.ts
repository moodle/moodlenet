import { Document, Edge as DocEdge } from 'arangojs/documents'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { ShallowEdge, ShallowEdgeByType, ShallowNode, ShallowNodeByType } from '../../../types.node'

export type DocumentEdgeDataByType<E extends EdgeType> = Omit<ShallowEdgeByType<E>, 'id'>
export type DocumentNodeDataByType<N extends NodeType> = Omit<ShallowNodeByType<N>, 'id'>
export type DocumentEdgeByType<E extends EdgeType> = DocEdge<ShallowEdgeByType<E>>
export type DocumentNodeByType<N extends NodeType> = Document<ShallowNodeByType<N>>
export type DocumentEdge = DocEdge<ShallowEdge>
export type DocumentNode = Document<ShallowNode>
