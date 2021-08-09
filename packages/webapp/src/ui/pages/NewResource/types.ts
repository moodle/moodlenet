export type ContentType = 'File' | 'Link'
export type Url = string
export type Category = string
export type Type = string
export type Level = string
export type Language = string
export type Format = string
export type License = string
export type Collection = unknown
export type NewResourceFormValues = {
  name: string
  contentType: ContentType
  title: string
  description: string
  category: Category
  image: Url | File | null
  content: Url | File
  addToCollections: Collection[]
  // extra
  type: Type | null
  level: Level | null
  originalDateMonth: string | null
  originalDateYear: string | null
  language: Language | null
  format: Format | null
  license: License | null
}
