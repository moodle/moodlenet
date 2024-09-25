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
  license: null | License
  subject: null | Subject
  language: null | Language
  level: null | Level
  originalPublicationInfo: null | OriginalPublicationInfo
  type: null | Type
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
export interface LearningOutcome {
  sentence: string
  // add and validae other fields here ?
}
