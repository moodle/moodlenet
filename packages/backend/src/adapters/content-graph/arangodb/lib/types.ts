import { EdgeType, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Document, Edge as DocEdge } from 'arangojs/documents'
import { ShallowEdgeByType, ShallowNodeByType } from '../../../../graphql/types.node'

export type DocumentEdgeDataByType<E extends EdgeType> = Omit<ShallowEdgeByType<E>, 'id'>
export type DocumentNodeDataByType<N extends NodeType> = Omit<ShallowNodeByType<N>, 'id'>
export type DocumentEdgeByType<E extends EdgeType> = DocEdge<ShallowEdgeByType<E> & { _id: Id }>
export type DocumentNodeByType<N extends NodeType> = Document<ShallowNodeByType<N> & { _id: Id }>
export type DocumentEdge = DocumentEdgeByType<EdgeType>
export type DocumentNode = DocumentNodeByType<NodeType>
