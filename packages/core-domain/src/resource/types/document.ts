export interface ID {}
export interface FileContent {
  kind: 'file'
}
export interface LinkContent {
  kind: 'link'
  url: string
}
export type Content = FileContent | LinkContent

export type Image = FileImage | UrlImage

export interface FileImage {
  kind: 'file'
}
export interface UrlImage {
  kind: 'url'
  url: string
}
export type ResourceDoc = {
  meta: ResourceMeta
  content: Content
  image: Image | null
  id: ID
}

export interface ResourceMeta {
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

export interface Credits {
  owner: {
    url: string
    name: string
  }
  provider?: {
    name: string
    url: string
  }
}

export interface OriginalPublicationInfo {
  year: number
  month: number
}

export interface License {
  code: string
}
export interface Subject {
  code: string
}
export interface Language {
  code: string
}
export interface Level {
  code: string
}
export interface Type {
  code: string
}
export interface LearningOutcome {}
