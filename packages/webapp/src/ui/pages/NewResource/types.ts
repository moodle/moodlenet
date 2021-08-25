import { CollectionItem } from '../../components/cards/AddToCollectionsCard/AddToCollectionsCard'

export type ContentType = 'File' | 'Link'
export type Url = string
export type Category = string
export type Type = string
export type Level = string
export type Language = string
export type Format = string
export type License = string
export type Collection = string
export type NewResourceFormValues = {
  name: string
  contentType: 'File' | 'Link'
  title: string
  description: string
  category: Category
  image: Url | File | null
  content: Url | File
  collections: CollectionItem[]
  // extra
  type: Type | null
  level: Level | null
  originalDateMonth: string | null
  originalDateYear: string | null
  language: Language | null
  format: Format | null
  license: License | null
}
