import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import * as GQLResolvers from './types.graphql.gen'

export type NodeByType<T extends GQLTypes.NodeType> = GQLResolvers.ResolversParentTypes[T]
export type EdgeByType<T extends GQLTypes.EdgeType> = GQLResolvers.ResolversParentTypes[T]
