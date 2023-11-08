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

type NullableIfDraft<T, Draft> = (Draft extends 'draft' ? None : never) | T
export interface EdResourceDocument<is_draft extends 'draft' | void = void> {
  title: string
  description: string
  content: ResourceContent
  image: NullableIfDraft<Image, is_draft>
  license: NullableIfDraft<string, is_draft>
  subject: NullableIfDraft<string, is_draft>
  language: NullableIfDraft<string, is_draft>
  level: NullableIfDraft<string, is_draft>
  month: NullableIfDraft<string, is_draft>
  year: NullableIfDraft<string, is_draft>
  type: NullableIfDraft<string, is_draft>
  learningOutcomes: LearningOutcome[]
}

export type EditDraftForm = Partial<
  Omit<DraftDocument, 'image' | 'content'> & {
    image: { type: 'update'; provide: ProvidedImage } | { type: 'remove' } | { type: 'no-change' }
  }
>

export type DraftDocument = EdResourceDocument<'draft'>
export type PublishableMeta = EdResourceDocument

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
