import { Context } from '../../../MoodleNetGraphQL'
import { EdgeType as E, NodeType as N } from '../ContentGraph.graphql.gen'

export type IdKey = string & { readonly __: unique symbol }
export type Id = string & { readonly __: unique symbol }

export type PersistenceExecutionContext = Context

export type AccessType = 'read' | 'create' | 'update' | 'delete'
export enum BasicAccessPolicyType {
  Creator = 'Creator',
  AnyUser = 'AnyUser',
  Admins = 'Admins',
  Public = 'Public',
  Moderator = 'Moderator',
}

export type ContentGraph = Record<E, EdgeOptions>

export type EdgeOptions = {
  connections: Connection[]
}

export type Connection = {
  from: N
  to: N
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

export type TypeBasicAccessPolicies<T extends N | E> = {
  [glyphType in T]: Record<AccessType, BasicAccessPolicy>
}

export type GlyphTag = 'node' | 'edge'
export type BasicAccessPolicies = {
  edge: TypeBasicAccessPolicies<E>
  node: TypeBasicAccessPolicies<N>
}

// export type NodeDef ={

// }
