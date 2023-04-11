import { AuthDataRpc } from '@moodlenet/react-app/common'
import { HeaderMenuItem, Href } from '@moodlenet/react-app/ui'
import { PkgContextT } from '@moodlenet/react-app/web-lib'
import { ResourceExposeType } from './expose-def.mjs'

export type MyWebDeps = {
  me: ResourceExposeType
}

export type MyPkgContext = PkgContextT<MyWebDeps>
export type MainContextResource = MyPkgContext & {
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

export type ResourceFormRpc = {
  title: string
  description: string
}

export type ResourceDataRpc = {
  resourceId: string
  mnUrl: string
  contentType: 'link' | 'file'
  imageUrl: string | null

  contentUrl: string | null
  downloadFilename: string | null // specificContentType: string // ex: url, pdf, doc...
  isWaitingForApproval?: boolean // numLikes: number
}

export type ResourceStateRpc = {
  isPublished: boolean
  uploadProgress?: number // liked: boolean // bookmarked: boolean
}

export type ResourceContributorRpc = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export type ResourceRpc = {
  resourceForm: ResourceFormRpc
  access: ResourceAccessRpc
  state: Pick<ResourceStateRpc, 'isPublished'>
  data: ResourceDataRpc
  contributor: ResourceContributorRpc
}

export type ResourceFormProps = ResourceFormRpc
export type ResourceDataProps = ResourceDataRpc
export type ResourceStateProps = ResourceStateRpc
export type ResourceCardDataProps = ResourceCardDataRpc
export type ResourceAccessProps = ResourceAccessRpc & { isAuthenticated: boolean }
export type ResourceContributorProps = ResourceContributorRpc

export type ResourceProps = {
  resourceForm: ResourceFormProps
  access: ResourceAccessProps
  state: ResourceStateProps
  data: ResourceDataProps
  contributor: ResourceContributorProps
}

export type RpcCaller = {
  edit: (resourceKey: string, res: ResourceFormProps) => Promise<void>
  get: (resourceKey: string) => Promise<ResourceProps | undefined>
  _delete: (resourceKey: string) => Promise<void>
  setImage: (resourceKey: string, file: File) => Promise<string>
  setContent: (resourceKey: string, file: File | string) => Promise<string>
  setIsPublished: (resourceKey: string, approve: boolean) => Promise<void>
  create: () => Promise<{ _key: string }>
  // toggleBooÇkmark: (resourceKey: string) => Promise<ResourceTypeForm>  // toggleLike: (resourceKey: string) => Promise<ResourceTypeForm>
}
export type ResourceActions = {
  publish: () => void
  unpublish: () => void
  editData: (values: ResourceFormProps) => void
  setImage: (file: File) => Promise<string>
  setContent: (content: File | string) => void
  deleteResource(): Promise<void>
  // toggleLike(): unknown// toggleBookmark(): unknown
}

export type ResourceAccessRpc = {
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
  // canLike: boolean // canBookmark: boolean
}

export type ResourceCardDataRpc = {
  // tags?: FollowTag[]  // numLikes: number
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  resourceHomeHref?: Href
} & Pick<
  ResourceDataProps,
  | 'imageUrl'
  | 'downloadFilename'
  | 'contentType'
  | 'resourceId'
  | 'isWaitingForApproval'
  | 'contentUrl'
> &
  Pick<ResourceFormProps, 'title'>

export type ResourceCardState = {
  isSelected: boolean
  selectionMode: boolean // When selection resources to be added to a collection
  // liked: boolean
  // bookmarked: boolean
} & Pick<ResourceStateProps, 'isPublished'>

export type ResourceCardActions = Pick<ResourceActions, 'publish' | 'unpublish'>

export type ResourceCardAccess = Pick<
  ResourceAccessProps,
  'isAuthenticated' | 'canPublish' | 'canDelete' //  'canLike' | //  'canBookmark' |
> //   isCreator: boolean //   canEdit: boolean

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

export const getResourceTypeInfo = (
  isLikeOrFile?: 'link' | 'file',
  filename?: string | null,
): { typeName: string | null; typeColor: string | null } => {
  const filenameExtension = filename?.split('.').pop()
  const resourceType = isLikeOrFile === 'link' ? 'link' : filenameExtension ?? 'unknown'
  switch (resourceType) {
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
      return { typeName: `Spreadsheet`, typeColor: '#0f9d58' }
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
    case 'link':
      return { typeName: `Web page`, typeColor: '#C233C7' }
    case 'unknown':
      return { typeName: null, typeColor: null }
    default:
      return { typeName: resourceType, typeColor: '#15845A' }
  }
}

export const maxUploadSize = 1024 * 1024 * 50
