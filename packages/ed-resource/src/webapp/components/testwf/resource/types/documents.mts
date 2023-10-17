export interface ChoosenContentErrors {
  error: { type: 'file too big' } | { type: 'invalid link'; reason: string }
}

type ResourceContent = LinkContent | FileContent
interface LinkContent {
  type: 'link'
  link: string
}
interface FileContent {
  type: 'upload'
  url: string
  filename: string
  mimeType: string
  sizeBytes: number
}

export interface PublishableResourceDocument {
  title: string
  description: string
  subject: string
  license: string
  type: string
  level: string
  creationDate: { year: number; month: number }
  resourceContent: ResourceContent
}

export interface DraftResourceDocument {
  title?: null | string
  description?: null | string
  subject?: null | string
  license?: null | string
  type?: null | string
  level?: null | string
  creationDate?: null | { year: number; month: number }
  resourceContent?: ResourceContent
}
