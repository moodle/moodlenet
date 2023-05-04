import { getDomainUrl } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import type { PkgContextT } from '@moodlenet/react-app/webapp'
// import { AuthDataRpc } from '@moodlenet/web-user/common'
import type { ResourceExposeType } from './expose-def.mjs'

export type MyWebDeps = {
  me: ResourceExposeType
}

export type MyPkgContext = PkgContextT<MyWebDeps>
export type MainContextResource = MyPkgContext & {
  rpcCaller: RpcCaller
  // auth: AuthDataRpc
  // actionsMenu: MainActions
}
// export type MainActions = {
//   create: {
//     action: () => Promise<void>
//     menu: HeaderMenuItem
//   }
// }

export type ResourceFormRpc = {
  title: string
  description: string
  subject: string
  license: string
  type: string | undefined
  level: string | undefined
  month: string | undefined
  year: string | undefined
  language: string | undefined
  // addToCollections: string[]
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
  uploadProgress?: number
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
export type ResourceAccessProps = ResourceAccessRpc //& { isAuthenticated: boolean }
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
  setImage: (resourceKey: string, file: File | undefined | null) => Promise<string | null>
  setContent: (
    resourceKey: string,
    file: File | string | undefined | null,
  ) => Promise<string | null>
  setIsPublished: (resourceKey: string, approve: boolean) => Promise<void>
  create: () => Promise<{ _key: string }>
  // toggleBookmark: (resourceKey: string) => Promise<ResourceTypeForm>  // toggleLike: (resourceKey: string) => Promise<ResourceTypeForm>
}
export type ResourceActions = {
  publish: () => void
  unpublish: () => void
  editData: (values: ResourceFormProps) => void
  setImage: (file: File | undefined | null) => void
  setContent: (content: File | string | undefined | null) => void
  deleteResource(): void
  toggleLike(): void
  toggleBookmark(): unknown
}

export type ResourceAccessRpc = {
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
  canLike: boolean
  isAuthenticated: boolean
  canBookmark: boolean
}

export type ResourceCardDataRpc = {
  // tags?: FollowTag[]
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
} & Pick<ResourceStateProps, 'isPublished'>

export type ResourceCardActions = Pick<ResourceActions, 'publish' | 'unpublish'>

export type ResourceCardAccess = Pick<
  ResourceAccessProps,
  'canPublish' | 'canDelete' | 'canLike' | 'canBookmark' | 'isCreator' | 'isAuthenticated'
>
//   'canBookmark'    canEdit: boolean

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

export const getResourceDomainName = (url: string): string => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return 'youtube'
    case 'vimeo.com':
      return 'vimeo'
    default:
      return 'link'
  }
}

export const getResourceTypeInfo = (
  isLikeOrFile: 'link' | 'file',
  filenameOrUrl: string | null,
): { typeName: string | null; typeColor: string | null } => {
  const resourceType =
    (isLikeOrFile === 'file'
      ? filenameOrUrl?.split('.').pop()
      : filenameOrUrl
      ? getResourceDomainName(filenameOrUrl)
      : 'unknown') ?? 'unknown'
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
    case 'youtube':
      return { typeName: 'YouTube', typeColor: '#f00' }
    case 'vimeo':
      return { typeName: 'Vimeo', typeColor: '#00adef' }
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

import type { SchemaOf } from 'yup'
import { mixed, object, string } from 'yup'
export const maxUploadSize = 1024 * 1024 * 50

export const resourceValidationSchema: SchemaOf<ResourceFormProps> = object({
  subject: string().required(/* t */ `Please select a subject`),
  content: string().required(/* t */ `Please upload a content`),
  license: string().required(/* t */ `Please provide a license`),
  description: string().max(4096).min(3).required(/* t */ `Please provide a description`),
  title: string().max(160).min(3).required(/* t */ `Please provide a title`),
  language: string().optional(),
  level: string().optional(),
  month: string().optional(),
  type: string().optional(),
  visibility: mixed().required(/* t */ `Visibility is required`),
  year: string().when('month', (month, schema) => {
    return month ? schema.required(/* t */ `Please select a year`) : schema.optional()
  }),
})

export const contentValidationSchema: SchemaOf<{ content: File | string | undefined | null }> =
  object({
    content: string().required(`Please upload a content or a link`),
  })

export const imageValidationSchema: SchemaOf<{ image: File | string | undefined | null }> = object({
  image: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && v.size > maxUploadSize
        ? createError({
            message: /* t */ `The file is too big, reduce the size or provide a url`,
          })
        : true,
    )
    .optional(),
})
