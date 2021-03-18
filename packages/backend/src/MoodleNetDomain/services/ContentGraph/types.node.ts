import * as GQL from './ContentGraph.graphql.gen'
export * as Types from './ContentGraph.graphql.gen'

export type ShallowNode<N extends GQL.Node = GQL.Node> = Omit<N, '_rel'>
export type ShallowEdge<E extends GQL.Edge = GQL.Edge> = Omit<E, '___ nothing to omit ___'>

export type NodeByType<T extends GQL.NodeType> = GQL.ResolversParentTypes[T]
export type EdgeByType<T extends GQL.EdgeType> = GQL.ResolversParentTypes[T]

export type ShallowNodeByType<T extends GQL.NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends GQL.EdgeType> = ShallowEdge<EdgeByType<T>>

// export type QueryNodeShallowPayload = ShallowNode | GQL.QueryNodeError
// export type QueryEdgeShallowPayload = ShallowNode | GQL.QueryEdgeError
export type CreateNodeData<Type extends GQL.NodeType> = Omit<
  ShallowNodeByType<Type>,
  '_id' | '__typename' | '_meta' | '_rel'
>
export type CreateNodeShallowPayload<Type extends GQL.NodeType> = ShallowNodeByType<Type> | GQL.CreateNodeMutationError
export type CreateEdgeData<Type extends GQL.EdgeType> = Omit<ShallowEdgeByType<Type>, '_id' | '__typename' | '_meta'>
export type CreateEdgeShallowPayload<Type extends GQL.EdgeType> = ShallowEdgeByType<Type> | GQL.CreateEdgeMutationError

export type UpdateNodeShallowPayload = ShallowNode | GQL.UpdateNodeMutationError
export type UpdateEdgeShallowPayload = ShallowEdge | GQL.UpdateEdgeMutationError

export type DeleteNodeShallowPayload = ShallowNode | GQL.DeleteNodeMutationError
export type DeleteEdgeShallowPayload = ShallowEdge | GQL.DeleteEdgeMutationError

export type ShallowNodeMeta = Omit<GQL.NodeMeta, '__typename'>
export type ShallowEdgeMeta = Omit<GQL.EdgeMeta, '__typename'>
