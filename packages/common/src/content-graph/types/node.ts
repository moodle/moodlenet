import { AuthId } from '../../user-auth/types'

export type GraphNodeMap = {
  Collection: Collection
  IscedField: IscedField
  Organization: Organization
  Profile: Profile
  Resource: Resource
  IscedGrade: IscedGrade
  ResourceType: ResourceType
  FileFormat: FileFormat
  License: License
  Language: Language
}
export type GraphNodeType = keyof GraphNodeMap
export const nodeTypes: GraphNodeType[] = [
  'Language',
  'License',
  'Profile',
  'Collection',
  'Resource',
  'IscedField',
  'Organization',
  'IscedGrade',
  'ResourceType',
  'FileFormat',
]
export type GraphNode = GraphNodeMap[GraphNodeType]
export type GraphNodeByType<T extends GraphNodeType> = GraphNodeMap[T]

export type PermId = string
export type Slug = string

export type GraphNodeIdentifier<GNT extends GraphNodeType = GraphNodeType> = Pick<BaseGraphNode<GNT>, '_type'> &
  (Pick<BaseGraphNode<GNT>, '_permId'> | Pick<BaseGraphNode<GNT>, '_slug'>)

export type BaseGraphNode<GNT extends GraphNodeType = GraphNodeType> = {
  _type: GNT
  _permId: PermId
  _slug: Slug
  name: string
  description: string
}

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
  mimetype: string
}

export type Resource = BaseGraphNode<'Resource'> & {
  thumbnail: Maybe<AssetRef>
  content: AssetRef
  kind: ResourceKind
}

export type Language = BaseGraphNode<'Language'> & {
  part2b: string | null
  part2t: string | null
  part1: string | null
  scope: string
  langType: string
  name: string
}
