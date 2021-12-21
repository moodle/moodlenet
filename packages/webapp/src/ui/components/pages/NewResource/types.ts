import { CollectionItem } from '../../molecules/cards/AddToCollectionsCard/AddToCollectionsCard'

export type ContentType = 'File' | 'Link'
export type Url = string
export type Category = string
export type Type = string
export type Level = string
export type Language = string
export type Format = string
export type License = string
export type Collection = string
export type Visibility = string
export type NewResourceFormValues = {
  name: string
  contentType: ContentType
  title: string
  description: string
  category: Category
  visibility: Visibility
  image: Url | File | null
  imageUrl: Url | null
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
