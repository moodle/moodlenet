export interface ResourceFileContent {
  kind: 'file'
}
export interface ResourceLinkContent {
  kind: 'link'
  url: string
}

export interface FileImage {
  kind: 'file'
}
export interface UrlImage {
  kind: 'url'
  credits?: Credits | None
}
export type ResourceContent = ResourceFileContent | ResourceLinkContent
export type Image = FileImage | UrlImage

export type ProvidedResourceContent = ProvidedResourceLinkContent | ProvidedResourceFileContent
export type ProvidedImage = ProvidedUrlImage | ProvidedFileImage

export interface ProvidedResourceFileContent {
  kind: 'file'
  info: ProvidedFileInfo
}
export interface ProvidedResourceLinkContent {
  kind: 'link'
  url: string
}
export interface ProvidedUrlImage {
  kind: 'url'
  url: string
}
export interface ProvidedFileImage {
  kind: 'file'
  info: ProvidedFileInfo
}
interface ProvidedFileInfo {
  type: string
  size: number
  name: string
}

export interface PublishableDocument {
  title: string
  description: string
  content: ResourceContent
  image: Image | null
  license: string
  subject: string
  language: string
  level: string
  month: string
  year: string
  type: string
  learningOutcomes: LearningOutcome[]
}
export interface DraftDocument {
  title: string
  description: string
  content: ResourceContent
  image: Image | null
  license: string | null
  subject: string | null
  language: string | null
  level: string | null
  month: string | null
  year: string | null
  type: string | null
  learningOutcomes: LearningOutcome[]
}

export type EditDraftForm = Partial<
  Omit<DraftDocument, 'image' | 'content'> & {
    image: { type: 'update'; provide: ProvidedImage } | { type: 'remove' } | { type: 'no-change' }
  }
>

export interface LearningOutcome {
  code: string
  verb: string
  sentence: string
}

export type ResourcePopularityItem = { value: number }
export type Credits = {
  owner: { url: string; name: string }
  provider?: { name: string; url: string }
}
type None = null | undefined
