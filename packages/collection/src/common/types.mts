import { AuthDataRpc } from '@moodlenet/react-app/common'
import { HeaderMenuItem, Href } from '@moodlenet/react-app/ui'
import { PkgContextT } from '@moodlenet/react-app/web-lib'
import { expose as me } from '../server/expose.mjs'

export type MyWebDeps = {
  me: typeof me
}

export type MyPkgContext = PkgContextT<MyWebDeps>
export type MainContextCollection = MyPkgContext & {
  rpcCaller: RpcCaller
  auth: AuthDataRpc
  actionsMenu: MainActions
}

export type MainActions = {
  create: {
    action: () => Promise<void>
    menu: HeaderMenuItem
  }
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
  canDelete: boolean // canFollow: boolean // canBookmark: boolean
}

export type CollectionDataRpc = {
  collectionId: string
  mnUrl: string
  imageUrl?: string
  isWaitingForApproval?: boolean
  // numFollowers: number
}

export type CollectionStateRpc = {
  isPublished?: boolean
  numResources?: number // followed: boolean // bookmarked: boolean
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
}

export type CollectionAccessProps = CollectionAccessRpc & { isAuthenticated: boolean }
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
}

export type RpcCaller = {
  edit: (key: string, values: CollectionFormProps) => Promise<CollectionFormProps>
  get: (key: string) => Promise<CollectionProps>
  _delete: (key: string) => Promise<CollectionProps>
  setIsPublished: (key: string, publish: boolean) => Promise<CollectionProps>
  setImage: (key: string, file: File) => Promise<CollectionProps>
  create: () => Promise<CollectionProps>
}

export type CollectionActions = {
  publish: () => Promise<void>
  unpublish: () => Promise<void>
  editData: (values: CollectionFormProps) => Promise<void>
  deleteCollection(): Promise<void>
  setImage: (file: File) => Promise<void> // toggleFollow(): void // toggleBookmark(): void
}

export type CollectionMainProps = {
  actions: CollectionActions
  props: CollectionProps
}

export type CollectionCardData = { collectionHref: Href } & Pick<
  CollectionDataProps,
  'collectionId' | 'imageUrl'
> &
  Pick<CollectionFormProps, 'title'>

export type CollectionCardState = Pick<CollectionStateProps, 'isPublished' | 'numResources'>
export type CollectionCardActions = Pick<CollectionActions, 'publish' | 'unpublish'>
export type CollectionCardAccess = Pick<
  CollectionAccessProps,
  'isAuthenticated' | 'isCreator' | 'canPublish' // |   'canFollow'  // | 'canBookmark'
>

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  color: string // description: string
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
