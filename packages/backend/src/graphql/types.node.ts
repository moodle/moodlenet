import * as GQL from './types.graphql.gen'
export * as Types from './types.graphql.gen'

export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, `_${string}`>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<E, `_${string}`>

export type NodeByType<T extends GQL.NodeType> = GQL.ResolversParentTypes[T]
export type EdgeByType<T extends GQL.EdgeType> = GQL.ResolversParentTypes[T]

export type ShallowNodeByType<T extends GQL.NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends GQL.EdgeType> = ShallowEdge<EdgeByType<T>>
