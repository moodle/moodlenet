import { stringUnionList } from '../../utils/misc'
import { Timestamp } from './common'

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
export const nodeTypes = stringUnionList<GraphNodeType>({
  Profile: 0,
  Collection: 0,
  IscedField: 0,
  IscedGrade: 0,
  Organization: 0,
  Resource: 0,
  Language: 0,
  License: 0,
  ResourceType: 0,
  FileFormat: 0,
})

export type GraphNode<T extends GraphNodeType = GraphNodeType> = GraphNodeMap[T]

export type PermId = string
export type Slug = string

export type GraphNodeIdentifierSlug<GNT extends GraphNodeType = GraphNodeType> = Pick<
  BaseGraphNode<GNT>,
  '_type' | '_slug'
>
export type GraphNodeIdentifierPerm<GNT extends GraphNodeType = GraphNodeType> = Pick<
  BaseGraphNode<GNT>,
  '_type' | '_permId'
>
export type GraphNodeIdentifierAuth<GNT extends GraphNodeType = GraphNodeType> = Pick<
  BaseGraphNode<GNT>,
  '_type' | '_authKey'
>

export type GraphNodeIdentifier<GNT extends GraphNodeType = GraphNodeType> =
  | GraphNodeIdentifierSlug<GNT>
  | GraphNodeIdentifierPerm<GNT>
  | GraphNodeIdentifierAuth<GNT>

export const isGraphNodeIdentifierAuth = (_: any): _ is GraphNodeIdentifierAuth =>
  !!_ && 'string' === typeof _._authKey && nodeTypes.includes(_._type)
export type AuthKey = string

export type BaseGraphNode<GNT extends GraphNodeType = GraphNodeType> = {
  _type: GNT
  _authKey: AuthKey | null
  _permId: PermId
  _slug: Slug
  _published: boolean
  _created: Timestamp
  _edited: Timestamp
  _creator: null | GraphNodeIdentifierAuth
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
  introTitle: string
  intro: string
  logo: Maybe<AssetRef>
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
}

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
