import { Visibility } from './FieldsData'

export type NewResourceFormValues = {
  // upload
  name: string
  description: string
  category: string
  license?: string
  visibility: Visibility
  image?: string | File | null
  content: string | File
  // add to collections
  addToCollections: string[]
  // extra
  type?: string
  level?: string
  month?: string
  year?: string
  language?: string
}
