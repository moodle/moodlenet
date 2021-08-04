import { AuthId } from '../../user-auth/types'

export type GraphNodeMap = {
  UserRole: UserRole
  Collection: Collection
  IscedField: IscedField
  Organization: Organization
  Profile: Profile
  Resource: Resource
  IscedGrade: IscedGrade
}
export type GraphNodeType = keyof GraphNodeMap
export type GraphNode = GraphNodeMap[GraphNodeType]
export type GraphNodeByType<T extends GraphNodeType> = GraphNodeMap[T]

export type PermId = string
export type Slug = string

export type BaseGraphNode<GNT extends GraphNodeType = GraphNodeType> = {
  _type: GNT
  _permId: PermId
  _slug: Slug
  name: string
}

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

export type IscedField = BaseGraphNode<'IscedField'> & {
  description: string
  codePath: Array<string>
  iscedCode: string
}

export type IscedGrade = BaseGraphNode<'IscedGrade'> & {
  description: string
  codePath: Array<string>
  iscedCode: string
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
