export interface Refs {
  content: Content
  image: Image | null
  id: ID
}
export interface ID {}
export interface FileContent {
  kind: 'file'
}
export interface LinkContent {
  kind: 'link'
}
export type Content = FileContent | LinkContent

export type Image = FileImage | LinkImage

export interface FileImage {
  kind: 'file'
}
export interface LinkImage {
  kind: 'link'
  credits?: ImageCredits
}
export interface ImageCredits {}

export interface ResourceMeta {
  references: Refs
  title: string
  description: string
  license?: License
  subject?: Subject
  language?: Language
  level?: Level
  originalPublicationInfo?: OriginalPublicationInfo
  type?: Type
  learningOutcomes: LearningOutcome[]
}

export interface OriginalPublicationInfo {
  year: number
  month: number
}

export interface License {}
export interface Subject {}
export interface Language {}
export interface Level {}
export interface Month {}
export interface Year {}
export interface Type {}
export interface LearningOutcome {}
