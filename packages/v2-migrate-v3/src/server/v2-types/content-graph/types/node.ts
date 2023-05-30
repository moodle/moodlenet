import type { Credits } from '../../graphql/scalars.graphql.js'
import type { Timestamp } from './common.js'

export type GraphNodeMap = {
  Collection: Collection
  IscedField: IscedField
  Organization: Organization
  Profile: Profile
  Resource: Resource
  IscedGrade: IscedGrade
  Language: Language
  License: License
  ResourceType: ResourceType
  FileFormat: FileFormat
}

export type GraphNodeType = keyof GraphNodeMap
export const nodeTypes = [
  'Profile',
  'Collection',
  'IscedField',
  'IscedGrade',
  'Organization',
  'Resource',
  'Language',
  'License',
  'ResourceType',
  'FileFormat',
] as const

export type GraphNode<T extends GraphNodeType = GraphNodeType> = GraphNodeMap[T]

export type PermId = string
export type Slug = string

export type GraphNodeIdentifierSlug<GNT extends GraphNodeType = GraphNodeType> = {
  '@': never | GNT
}
export type GraphNodeIdentifierPerm<GNT extends GraphNodeType = GraphNodeType> = {
  '@': never | GNT
  '_key': string
  '_id': string
}

export type GraphNodeIdentifierAuth<GNT extends GraphNodeType = GraphNodeType> = {
  _authKey: AuthKey
} & GraphNodeIdentifierPerm<GNT>

export type GraphNodeNonIdentifiedAuth<GNT extends GraphNodeType = GraphNodeType> = {
  _authKey: null
} & GraphNodeIdentifierPerm<GNT>

export type GraphNodeIdentifier<GNT extends GraphNodeType = GraphNodeType> =
  | GraphNodeIdentifierSlug<GNT>
  | GraphNodeIdentifierPerm<GNT>
  | GraphNodeIdentifierAuth<GNT>

export const isGraphNodeIdentifierAuth = (_: any): _ is GraphNodeIdentifierAuth =>
  !!_ && 'string' === typeof _._authKey && nodeTypes.includes(_._type)
export type AuthKey = string

export type BaseGraphNode<GNT extends GraphNodeType = GraphNodeType> = {
  _published: boolean
  _created: Timestamp
  _edited: Timestamp
  _creator: GraphNodeIdentifierAuth
  _local: boolean
  name: string
  description: string
} & GraphNodeIdentifierSlug<GNT> &
  GraphNodeIdentifierPerm<GNT> &
  (GraphNodeIdentifierAuth<GNT> | GraphNodeNonIdentifiedAuth<GNT>)

type Maybe<T> = T | null | undefined

export type Collection = BaseGraphNode<'Collection'> & {
  image: Maybe<AssetRef>
}

export type ResourceType = BaseGraphNode<'ResourceType'> & {
  code: string
}

export type FileFormatType =
  | 'application'
  | 'audio'
  | 'font'
  | 'image'
  | 'message'
  | 'model'
  | 'multipart'
  | 'text'
  | 'video'
export type FileFormat = BaseGraphNode<'FileFormat'> & {
  code: string
  type: FileFormatType
  subtype: string
}

export type License = BaseGraphNode<'License'> & {
  code: string
}

export type IscedField = BaseGraphNode<'IscedField'> & {
  codePath: Array<string>
  code: string
}

export type IscedGrade = BaseGraphNode<'IscedGrade'> & {
  codePath: Array<string>
  code: string
}

export type Organization = BaseGraphNode<'Organization'> & {
  subtitle: string
  logo: AssetRef
  smallLogo: AssetRef
  color: string
  domain: string
}

export type Profile = BaseGraphNode<'Profile'> & {
  avatar: Maybe<AssetRef>
  bio: Maybe<string>
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
  mimetype: string
  credits?: Credits | null
}
export const isAssetRef = (_: any): _ is AssetRef =>
  !!_ &&
  typeof _.ext === 'boolean' &&
  typeof _.location === 'string' &&
  typeof _.mimetype === 'string'
export const isSameAssetRef = (_: any, __: any) =>
  isAssetRef(__) && isAssetRef(_) && __.ext === _.ext && __.location === _.location

export type Resource = BaseGraphNode<'Resource'> & {
  image: Maybe<AssetRef>
  content: AssetRef
  kind: ResourceKind
  originalCreationDate: Maybe<Timestamp>
}

export type Language = BaseGraphNode<'Language'> & {
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  langType: string
  name: string
}
