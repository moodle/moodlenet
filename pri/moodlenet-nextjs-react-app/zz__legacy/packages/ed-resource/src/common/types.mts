import type { IconTextOptionProps, TextOptionProps } from '@moodlenet/component-library'
import { getDomainUrl } from '@moodlenet/component-library/common'
import type { StateName } from '@moodlenet/core-domain/resource'
import type { Href } from '@moodlenet/react-app/common'
// import { AuthDataRpc } from '@moodlenet/web-user/common'
import type { AssetInfo } from '@moodlenet/component-library/common'
import type { RpcFile } from '@moodlenet/core'
import type { LearningOutcome, LearningOutcomeOption } from '@moodlenet/ed-meta/common'
import type { ResourceExposeType, WebappConfigsRpc } from './expose-def.mjs'
import type { ValidationSchemas } from './validationSchema.mjs'
export type EdResourceEntityNames = 'Resource'
export type MyWebDeps = {
  me: ResourceExposeType
}

export type MainContextResource = {
  configs: WebappConfigsRpc
  validationSchemas: ValidationSchemas
}

export type ResourceMetaFormRpc = {
  title: string
  description: string
  subject: string
  license: string
  type: string
  level: string
  month: string
  year: string
  language: string
  learningOutcomes: LearningOutcome[]
  // addToCollections: string[]
}

export type EditResourceFormRpc = {
  meta?: ResourceMetaFormRpc
  image?: { kind: 'remove' } | { kind: 'no-change' } | { kind: 'file'; file: [RpcFile] }
}
export type EditResourceRespRpc = { meta: ResourceMetaFormRpc; image: AssetInfo | null }
export type ResourceDataRpc = {
  id: string | null
  mnUrl: string
  contentType: 'link' | 'file' | null
  image: AssetInfo | null
  subjectHref: Href | null

  contentUrl: string | null
  downloadFilename: string | null // specificContentType: string // ex: url, pdf, doc...
}

export type AutofillState =
  //| 'extracting-info'
  'ai-generation' | 'ai-completed' | 'ai-error' | undefined // | 'ai-saved-generated-data'

export type AutofillSuggestions = {
  meta: null | Partial<ResourceFormProps>
  // image: null | AssetInfo
}

export type ResourceStateRpc = {
  isPublished: boolean
  // isUploaded: boolean
  uploadProgress: number | 'N/A' | undefined
  autofillSuggestions: null | AutofillSuggestions
  autofillState: AutofillState
}

export type ResourceContributorRpc = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export type ResourceRpc = {
  resourceForm: ResourceMetaFormRpc
  access: ResourceAccessRpc
  state: {
    value: StateName
  } & Pick<ResourceStateRpc, 'isPublished' | 'autofillSuggestions'>
  data: ResourceDataRpc
  contributor: ResourceContributorRpc
}

export type ResourceFormProps = {
  title: string
  description: string
  subject: string
  license: string
  type: string
  level: string
  month: string
  year: string
  language: string
  learningOutcomes: LearningOutcome[]
  // addToCollections: string[]
}

export type ResourceDataProps = {
  id: string | null
  mnUrl: string
  contentType: 'link' | 'file' | null
  image: AssetInfo | null
  subjectHref: Href | null

  contentUrl: string | null
  downloadFilename: string | null // specificContentType: string // ex: url, pdf, doc...
}
export type ResourceStateProps = {
  isPublished: boolean
  // isUploaded: boolean
  uploadProgress: number | 'N/A' | undefined
  autofillState: AutofillState
  // autofillSu ggestions: null | AutofillSuggestions
}
export type ResourceCardDataProps = {
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  resourceHomeHref: Href
} & Pick<ResourceDataProps, 'image' | 'downloadFilename' | 'contentType' | 'contentUrl' | 'id'> &
  Pick<ResourceFormProps, 'title'>
export type ResourceAccessProps = {
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
}
export type EdMetaOptionsProps = {
  typeOptions: TextOptionProps[]
  monthOptions: TextOptionProps[]
  yearOptions: string[]
  languageOptions: TextOptionProps[]
  levelOptions: TextOptionProps[]
  licenseOptions: IconTextOptionProps[]
  subjectOptions: TextOptionProps[]
  learningOutcomeOptions: LearningOutcomeOption[]
}
export type ResourceContributorProps = {
  avatarUrl: string | null
  displayName: string
  timeSinceCreation: string
  creatorProfileHref: Href
}

export type ResourceProps = {
  resourceForm: ResourceFormProps
  access: ResourceAccessProps
  state: ResourceStateProps
  data: ResourceDataProps
  contributor: ResourceContributorProps
}
export type SavingState = 'not-saving' | 'saving' | 'save-done'
export type SaveState = { form: SavingState; image: SavingState; content: SavingState }

export type RpcCaller = {
  create: (content: File | string, taskId: string) => Promise<{ _key: string }>
  get: (resourceKey: string) => Promise<ResourceProps | null>
  edit: (
    resourceKey: string,
    res: Partial<EditResourceFormRpc>,
    taskId: string,
  ) => Promise<EditResourceRespRpc>
  setIsPublished: (resourceKey: string, approve: boolean) => Promise<{ done: boolean }>
  trash: (resourceKey: string) => Promise<void>
  // setImage: (
  //   resourceKey: string,
  //   file: File | undefined | null,
  //   rpcId: string,
  // ) => Promise<string | null>
}
export type ResourceActions = {
  publish: () => void
  unpublish: () => void
  editData: (values: ResourceFormProps) => void
  setImage: (image: File | undefined | null) => void
  provideContent: (content: File | string) => void
  deleteResource(): void
  startAutofill(): void
  stopAutofill(): void
  cancelUpload(): void
}

export type ResourceAccessRpc = {
  isCreator: boolean
  canEdit: boolean
  canPublish: boolean
  canDelete: boolean
}

export type ResourceCardDataRpc = {
  owner: {
    displayName: string
    avatar: string | null
    profileHref: Href
  }
  resourceHomeHref: Href
} & Pick<ResourceDataProps, 'image' | 'downloadFilename' | 'contentType' | 'contentUrl' | 'id'> &
  Pick<ResourceFormProps, 'title'>

export type ResourceCardState = {
  // isSelected: boolean
  // selectionMode: boolean // When selection resources to be added to a collection
} & Pick<ResourceStateProps, 'isPublished' | 'autofillState'>

export type ResourceCardActions = Pick<ResourceActions, 'publish' | 'unpublish'>

export type ResourceCardAccess = Pick<ResourceAccessProps, 'canPublish' | 'canDelete' | 'isCreator'>
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

export type ResourceSearchResultRpc = {
  endCursor?: string
  list: { _key: string }[]
}
export type SortTypeRpc = 'Relevant' | 'Popular' | 'Recent'
export function isSortTypeRpc(_: any): _ is SortTypeRpc {
  return ['Relevant', 'Popular', 'Recent'].includes(_)
}

export const getResourceDomainName = (url: string): string | undefined => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return 'youtube'
    case 'vimeo.com':
      return 'vimeo'
    case undefined:
      return 'unknown'
    default:
      return 'link'
  }
}

export const getResourceTypeInfo = (
  isLinkOrFile: 'link' | 'file' | null,
  filenameOrUrl: string | null,
): { typeName: string | null; typeColor: string | null } => {
  if (!isLinkOrFile) return { typeName: null, typeColor: null }
  const resourceType =
    (isLinkOrFile === 'file'
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
