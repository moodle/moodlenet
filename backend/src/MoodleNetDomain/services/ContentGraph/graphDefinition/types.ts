import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import {
  EdgeType,
  Node,
  NodeType,
  ResolversParentTypes,
} from '../ContentGraph.graphql.gen'
import { ShallowEdge, ShallowNode } from '../persistence/types'

export type IdKey = string & { readonly __: unique symbol }
export type Id = string & { readonly __: unique symbol }

export type PersistenceExecutionContext = MoodleNetExecutionContext

export type AccessType = 'read' | 'create' | 'update' | 'delete'
export enum BasicAccessPolicyType {
  Creator = 'Creator',
  AnyUser = 'AnyUser',
  Admins = 'Admins',
  Public = 'Public',
  Moderator = 'Moderator',
}

export type ContentGraph = Record<EdgeType, EdgeOptions>

export type EdgeOptions = {
  connections: Connection[]
}

export type Connection = {
  from: NodeType
  to: NodeType
  toMyselfOnly?: boolean
  fromMyselfOnly?: boolean
  nodeCreatorPolicy?: {
    to?: BasicAccessPolicy
    from?: BasicAccessPolicy
  }
  maxSelfConnection?: number
  maxOverlaps?: number
  maxOutbounds?: number
  maxInbounds?: number
}
// Access
export type BasicAccessPolicyGroup =
  | {
      and: BasicAccessPolicy[]
    }
  | {
      or: BasicAccessPolicy[]
    }

export type BasicAccessPolicy = BasicAccessPolicyType | BasicAccessPolicyGroup

export type TypeBasicAccessPolicies<T extends NodeType | EdgeType> = {
  [glyphType in T]: Record<AccessType, BasicAccessPolicy>
}

export type GlyphTag = 'node' | 'edge'
export type BasicAccessPolicies = {
  edge: TypeBasicAccessPolicies<EdgeType>
  node: TypeBasicAccessPolicies<NodeType>
}

// export type NodeDef ={

// }
export type NodeByType<
  T extends NodeType
> = ResolversParentTypes[T] extends Node ? ResolversParentTypes[T] : never
export type EdgeByType<T extends EdgeType> = ResolversParentTypes[T]
export type ShallowNodeByType<T extends NodeType> = ShallowNode<NodeByType<T>>
export type ShallowEdgeByType<T extends EdgeType> = ShallowEdge<EdgeByType<T>>
