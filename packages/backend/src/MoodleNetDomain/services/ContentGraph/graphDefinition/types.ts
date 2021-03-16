import { MoodleNetExecutionContext } from '../../../MoodleNetGraphQL'
import { EdgeType, NodeType } from '../ContentGraph.graphql.gen'

export type PersistenceExecutionContext = MoodleNetExecutionContext

export type AccessType = 'read' | 'create' | 'update' | 'delete'

//TODO: define different specific Policy types:
//TODO: GlyphRead, GlyphUpdate, GlyphCreate, GlyphDelete, EdgeNode
//TODO: Make generic<PolicyType> on BasicAccessPolicy, BasicAccessPolicyType, BasicAccessPolicyGroup, BasicAccessFilterEngine,

export enum BasicAccessPolicyType {
  Creator = 'Creator',
  AnyProfile = 'AnyProfile',
  Admins = 'Admins',
  Public = 'Public',
  Moderator = 'Moderator',
}

export type ContentGraph = { [edgeName in EdgeType]: EdgeOptions }

export type EdgeOptions = {
  connections: Connection[]
}

export type Connection = {
  from: NodeType
  to: NodeType
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
