import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import * as GQLResolvers from './types.graphql.gen'

export type ShallowNode<N extends GQLTypes.Node = GQLTypes.Node> = Omit<N, `_${string}`>
export type ShallowEdge<E extends GQLTypes.Edge = GQLTypes.Edge> = Omit<E, `_${string}`>

export type NodeByType<T extends GQLTypes.NodeType> = GQLResolvers.ResolversParentTypes[T]
export type EdgeByType<T extends GQLTypes.EdgeType> = GQLResolvers.ResolversParentTypes[T]

export type ShallowNodeByType<T extends GQLTypes.NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends GQLTypes.EdgeType> = ShallowEdge<EdgeByType<T>>
