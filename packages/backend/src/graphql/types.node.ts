import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import * as GQLResolvers from './types.graphql.gen'

type NodeFeatureProp = '_organization' | '_created' | '_lastEdited' | '_rel' | '_relCount'
export type ShallowNode<N extends GQLTypes.Node = GQLTypes.Node> = Omit<N, NodeFeatureProp>
export type ShallowEdge<E extends GQLTypes.Edge = GQLTypes.Edge> = Omit<E, `_${string}`> & Pick<E, '__typename'>

export type NodeType = GQLTypes.NodeType
export type EdgeType = GQLTypes.EdgeType
export type NodeByType<T extends GQLTypes.NodeType> = GQLResolvers.ResolversParentTypes[T]
export type EdgeByType<T extends GQLTypes.EdgeType> = GQLResolvers.ResolversParentTypes[T]

export type ShallowNodeByType<T extends GQLTypes.NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends GQLTypes.EdgeType> = ShallowEdge<EdgeByType<T>>
