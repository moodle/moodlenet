// http://link.to/specdocuments (user story, digrams github issue discussions)

export type ChoosenContent = ChoosenLinkResource | ChoosenFileResource
export interface ChoosenLinkResource {
  type: 'link'
  link: string
}
export interface ChoosenFileResource {
  type: 'file'
  file: File
}

export type Progress = number | 'Not available'
