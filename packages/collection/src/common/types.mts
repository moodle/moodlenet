import { Href } from '@moodlenet/react-app/ui'
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
}

export type RpcCaller = {
  edit: (collectionId: string, values: CollectionFormValues) => Promise<unknown>
  get: (collectionId: string, query?: string) => Promise<CollectionDataResponce | null>
  _delete: (collectionId: string) => Promise<unknown>
  toggleFollow: (collectionId: string) => Promise<unknown>
  setIsPublished: (collectionId: string, publish: boolean) => Promise<unknown>
  toggleBookmark: (collectionId: string) => Promise<unknown>
}

export type CollectionContributorCardProps = {
  avatarUrl: string | null
  displayName: string
  creatorProfileHref: Href
}

export type CollectionDataResponce = {
  data: Collectiondata
  form: CollectionFormValues
  state: CollectionState
  access: CollectionAccess
  contributor: CollectionContributorCardProps
}

export type MainPropsCollection = {
  actions: CollectionActions
  props: CollectionDataResponce
}

export type Collectiondata = {
  id: string
  mnUrl: string
  numFollowers: number
  isPublished: boolean
  isWaitingForApproval?: boolean
}

export type CollectionFormValues = {
  name: string
  description: string
  image: string | File | null
}

export type CollectionState = {
  followed: boolean
  bookmarked: boolean
  isSaving?: boolean
  isSaved?: boolean
}

export type CollectionActions = {
  setIsPublished: (publish: boolean) => void
  editCollection: (values: CollectionFormValues) => Promise<unknown>
  deleteCollection(): unknown
  toggleFollow(): unknown
  toggleBookmark(): unknown
}

export type CollectionAccess = {
  isAuthenticated: boolean
  isCreator: boolean
  isAdmin: boolean
  canEdit: boolean
}

export type CollectionCardData = {
  collectionId: string
  imageUrl?: string | null
  title: string
  collectionHref: Href
}

export type CollectionCardState = {
  isPublished: boolean
  bookmarked: boolean
  followed: boolean
  numFollowers: number
  numResource: number
}
export type CollectionCardActions = {
  publish: () => void
  setIsPublished: (publish: boolean) => void
  toggleFollow: () => unknown
  toggleBookmark: () => unknown
}

export type CollectionCardAccess = {
  isAuthenticated: boolean
  canEdit: boolean
  isCreator: boolean
}

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
