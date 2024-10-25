import type { AssetInfo } from '@moodlenet/component-library/common'
import type { Href } from '@moodlenet/react-app/common'
import type { CollectionExposeType, WebappConfigsRpc } from './expose-def.mjs'
import type { ValidationSchemas } from './validationSchema.mjs'

export type CollectionEntityNames = 'Collection'

export type MyWebDeps = {
  me: CollectionExposeType
}
export type MainContextCollection = {
  rpcCaller: RpcCaller
  configs: WebappConfigsRpc
  validationSchemas: ValidationSchemas
}

export type CollectionContributorRpc = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: Href
}

export type CollectionAccessRpc = {
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
}

export type CollectionDataRpc = {
  id: string
  mnUrl: string
  image: AssetInfo | null
}

export type CollectionStateRpc = {
  numResources: number
  isPublished: boolean
}

export type CollectionFormRpc = {
  title: string
  description: string
}

export type CollectionRpc = {
  data: CollectionDataProps
  form: CollectionFormProps
  state: CollectionStateProps
  access: CollectionAccessRpc
  contributor: CollectionContributorProps
  resourceList: { _key: string }[]
}

export type CollectionAccessProps = CollectionAccessRpc
export type CollectionDataProps = CollectionDataRpc
export type CollectionStateProps = CollectionStateRpc
export type CollectionFormProps = CollectionFormRpc
export type CollectionContributorProps = CollectionContributorRpc

export type CollectionProps = {
  data: CollectionDataProps
  form: CollectionFormProps
  state: CollectionStateProps
  access: CollectionAccessProps
  contributor: CollectionContributorProps
  resourceList: { _key: string }[]
}
export type CollectionsResorce = {
  collectionKey: string
  collectionName: string
  hasResource: boolean
}

export type RpcCaller = {
  collectionsResorce: (containingResourceKey: string) => Promise<CollectionsResorce[]>
  actionResorce: (
    collectionKey: string,
    action: 'remove' | 'add',
    resourceKey: string,
  ) => Promise<void>

  edit: (key: string, values: CollectionFormProps) => Promise<void>
  get: (key: string) => Promise<CollectionRpc | null>
  _delete: (key: string) => Promise<void>
  setIsPublished: (key: string, publish: boolean) => Promise<void>
  setImage: (key: string, file: File | null | undefined, rpcId: string) => Promise<string | null>
  create: () => Promise<{ _key: string }>
}

export type CollectionActions = {
  publish: () => void
  unpublish: () => void
  editData: (values: CollectionFormProps) => void
  removeResource: (key: string) => void
  deleteCollection(): void
  setImage: (image: File | undefined | null) => void
}

export type CollectionMainProps = {
  actions: CollectionActions
  props: CollectionProps
  // saveState: SaveState
  isSaving: boolean
  isToDelete: boolean
}

export type CollectionCardData = { collectionHref: Href } & Pick<
  CollectionDataProps,
  'id' | 'image'
> &
  Pick<CollectionFormProps, 'title'>

export type CollectionCardState = Pick<CollectionStateProps, 'isPublished' | 'numResources'>
export type CollectionCardActions = Pick<CollectionActions, 'publish' | 'unpublish'>
export type CollectionCardAccess = Pick<CollectionAccessProps, 'isCreator' | 'canPublish'>

export type CollectionSearchResultRpc = {
  endCursor?: string
  list: { _key: string }[]
}
export type SortTypeRpc = 'Relevant' | 'Popular' | 'Recent'
export function isSortTypeRpc(_: any): _ is SortTypeRpc {
  return ['Relevant', 'Popular', 'Recent'].includes(_)
}

export const getCollectionTypeInfo = (type: string): { typeName: string; typeColor: string } => {
  switch (type) {
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'mkv':
    case 'webm':
    case 'avchd':
    case 'flv':
    case 'f4v':
    case 'swf':
      return { typeName: `Video`, typeColor: '#2A75C0' }
    case 'mp3':
    case 'wav':
    case 'wma':
    case 'aac':
    case 'm4a':
      return { typeName: `Audio`, typeColor: '#8033c7' }
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
      return { typeName: `Image`, typeColor: '#27a930' }
    case 'pdf':
      return { typeName: 'pdf', typeColor: '#df3131' }
    case 'xls':
    case 'xlsx':
    case 'ods':
      return { typeName: `Spreadshee`, typeColor: '#0f9d58' }
    case 'doc':
    case 'docx':
    case 'odt':
      return { typeName: 'Word', typeColor: '#4285f4' }
    case 'ppt':
    case 'pptx':
    case 'odp':
      return { typeName: `Presentation`, typeColor: '#dfa600' }
    case 'mbz':
      return { typeName: 'Moodle course', typeColor: '#f88012' }
    case 'Web Page':
      return { typeName: `Web page`, typeColor: '#C233C7' }
    default:
      return { typeName: type, typeColor: '#15845A' }
  }
}
