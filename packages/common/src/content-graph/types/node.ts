import { AuthId } from '../../user-auth/types'

export type GraphNodeType = 'Collection' | 'Iscedf' | 'UserRole' | 'Organization' | 'Profile' | 'Resource'
// export type GraphNodeType = GraphNode['_type']
export type GraphNode = Collection | Iscedf | UserRole | Organization | Profile | Resource
export type GraphNodeByType<T extends GraphNodeType> = GraphNodeMap[T]
// export type GraphNodeMap = {
//   [type in GraphNodeType]:
// }
export type GraphNodeMap = {
  UserRole: UserRole
  Collection: Collection
  Iscedf: Iscedf
  Organization: Organization
  Profile: Profile
  Resource: Resource
}

export type Timestamp = number
export type PermId = string
export type Slug = string

export type BaseGraphNode<GNT extends GraphNodeType = GraphNodeType> = {
  _type: GNT
  _permId: PermId
  _slug: Slug
  _status: NodeStatus
  name: string
}

export type NodeStatus = 'Active' | 'Deleted'

type Maybe<T> = T | null | undefined

export type UserRoleType = 'Admin' | 'Editor'

export type UserRole = BaseGraphNode<'UserRole'> & {
  type: UserRoleType
  descripton: string
}

export type Collection = BaseGraphNode<'Collection'> & {
  description: string
  image: Maybe<AssetRef>
}

export type Iscedf = BaseGraphNode<'Iscedf'> & {
  description: string
  codePath: Array<string>
  iscedCode: string
  thumbnail: Maybe<AssetRef>
  image: Maybe<AssetRef>
}

export type Organization = BaseGraphNode<'Organization'> & {
  intro: string
  logo: Maybe<AssetRef>
  color: string
  domain: string
}

export type Profile = BaseGraphNode<'Profile'> & {
  _authId: AuthId
  avatar: Maybe<AssetRef>
  bio: string
  image: Maybe<AssetRef>
  firstName: Maybe<string>
  lastName: Maybe<string>
  siteUrl: Maybe<string>
  location: Maybe<string>
}

export type ResourceKind = 'Upload' | 'Link'
export type AssetRef = {
  ext: boolean
  location: string
}
export type Resource = BaseGraphNode<'Resource'> & {
  description: string
  thumbnail: Maybe<AssetRef>
  content: AssetRef
  kind: ResourceKind
}
