export interface ChoosenContentErrors {
  error: { type: 'file too big' } | { type: 'invalid link'; reason: string }
}

export type ResourceContent = LinkContent | FileContent
export interface LinkContent {
  type: 'link'
  link: string
}
export interface FileContent {
  type: 'upload'
  url: string
  filename: string
  mimetype: string
  sizeBytes: number
}

export interface PublishableResourceDocument {
  id: string
  status: 'publishable'
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
  id: string
  status: 'draft'
  title?: string
  description?: string
  subject?: string
  license?: string
  type?: string
  level?: string
  creationDate?: { year: number; month: number }
  resourceContent: ResourceContent
}

export interface MaxFileSizeRules {
  maxFileSizeBytes: number
}
export interface LinkRules {
  regExpString: string
  ruleDescription: string
}
export interface AcceptableContentRules {
  maxFileSize: MaxFileSizeRules
  linkRules: LinkRules
}
