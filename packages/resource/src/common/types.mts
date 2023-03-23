import { FollowTag } from '@moodlenet/component-library'
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

export type ResourceFormValues = {
  name: string
  description: string
  content: string | File | null
  image: string | File | null
}

export type ResourceData = {
  id: string
  mnUrl: string
  numLikes: number
  contentType: 'link' | 'file'
  downloadFilename: string
  specificContentType: string // ex: url, pdf, doc...
  contentUrl: string
  isPublished: boolean
  isWaitingForApproval?: boolean
}

export type ResourceState = {
  isSaving?: boolean
  isSaved?: boolean
  liked: boolean
  bookmarked: boolean
  uploadProgress?: number
}

export type ResourceTypeForm = {
  resourceForm: ResourceFormValues
  authFlags: ResourceAccess
  state: ResourceState
  data: ResourceData
}

export type ResourceActions = {
  setIsPublished: (publish: boolean) => void
  toggleLike(): unknown
  toggleBookmark(): unknown
  editResource: (values: ResourceFormValues) => Promise<unknown>
  deleteResource(): unknown
}

export type RpcCaller = {
  edit: (resourceKey: string, res: ResourceFormValues) => Promise<ResourceFormValues>
  get: (resourceKey: string) => Promise<ResourceTypeForm>
  _delete: (resourceKey: string) => Promise<ResourceTypeForm>
  toggleBookmark: (resourceKey: string) => Promise<ResourceTypeForm>
  toggleLike: (resourceKey: string) => Promise<ResourceTypeForm>
  setIsPublished: (resourceKey: string, approve: boolean) => Promise<ResourceTypeForm>
}

export type ResourceAccess = {
  isAuthenticated: boolean
  isCreator: boolean
  isAdmin: boolean
  canEdit: boolean
}

export type ResourceCardData = {
  resourceId: string
  tags?: FollowTag[]
  image?: string | null
  type: string //'Video' | 'Web Page' | 'Moodle Book'
  title: string
  isPublished: boolean
  numLikes: number
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  resourceHomeHref?: Href
}

export type ResourceCardState = {
  isSelected: boolean
  selectionMode: boolean // When selection resources to be added to a collection
  liked: boolean
  bookmarked: boolean
}

export type ResourceCardActions = {
  toggleLike: () => void
  toggleBookmark: () => void
  publish: () => void
  setIsPublished: (publish: boolean) => void
}

export type ResourceCardAccess = {
  isCreator: boolean
  canEdit: boolean
  isAuthenticated: boolean
}

export type Organization = {
  name: string
  shortName: string
  title: string
  subtitle: string
  url: string
  logo: string
  smallLogo: string
  color: string
}

export const getResourceTypeInfo = (type: string): { typeName: string; typeColor: string } => {
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
