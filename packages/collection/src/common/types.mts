import { HeaderMenuItem, Href } from '@moodlenet/react-app/ui'
import { ClientSessionData, PkgContextT } from '@moodlenet/react-app/web-lib'
import { expose as me } from '../server/expose.mjs'

export type MyWebDeps = {
  me: typeof me
}

export type MyPkgContext = PkgContextT<MyWebDeps>
export type MainContextResourceType = MyPkgContext & {
  rpcCaller: RpcCaller
  auth: {
    isAuthenticated: boolean
    isAdmin: boolean
    clientSessionData: ClientSessionData | null | undefined
  }
  actionsMenu: MainActions
}

export type RpcCaller = {
  edit: (
    collectionId: string,
    values: CollectionFormValues,
  ) => Promise<CollectionFormValues | undefined>
  get: (collectionId: string) => Promise<CollectionDataResponce | undefined>
  _delete: (collectionId: string) => Promise<void>
  setIsPublished: (collectionId: string, publish: boolean) => Promise<void>
  setImage: (collectionId: string, file: File) => Promise<void>
  create: () => Promise<{ _key: string }>
}

export type MainActions = {
  create: {
    action: () => Promise<void>
    menu: HeaderMenuItem
  }
}

export type CollectionContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: Href
}

export type CollectionDataResponce = {
  data: CollectionData
  form: CollectionFormValues
  state: CollectionState
  access: Pick<CollectionAccess, 'canDelete' | 'canEdit' | 'canPublish'>
  contributor: { _key: string } & CollectionContributorCardProps
}

export type MainPropsCollection = {
  actions: CollectionActions
  props: CollectionDataResponce
}

export type CollectionData = {
  collectionId: string
  mnUrl: string
  imageUrl?: string
  isWaitingForApproval?: boolean
  // numFollowers: number
}

export type CollectionFormValues = {
  title: string
  description: string
}

export type CollectionState = {
  isPublished?: boolean
  numResources?: number
  // followed: boolean
  // bookmarked: boolean
}

export type CollectionActions = {
  publish: () => Promise<void>
  unpublish: () => Promise<void>
  editData: (values: CollectionFormValues) => Promise<void>
  deleteCollection(): Promise<void>
  setImage: (file: File) => Promise<void>
  // toggleFollow(): void
  // toggleBookmark(): void
}

export type CollectionAccess = {
  isAuthenticated: boolean
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
  // canFollow: boolean
  // canBookmark: boolean
}

export type CollectionCardData = { collectionHref: Href } & Pick<
  CollectionData,
  'collectionId' | 'imageUrl'
> &
  Pick<CollectionFormValues, 'title'>

export type CollectionCardState = Pick<CollectionState, 'isPublished' | 'numResources'>

export type CollectionCardActions = Pick<CollectionActions, 'publish' | 'unpublish'>

export type CollectionCardAccess = Pick<
  CollectionAccess,
  'isAuthenticated' | 'isCreator' | 'canPublish'
  // |   'canFollow'
  // | 'canBookmark'
>

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  // description: string
  color: string
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

export const maxUploadSize = 1024 * 1024 * 50
