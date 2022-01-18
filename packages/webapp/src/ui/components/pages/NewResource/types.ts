export type NewResourceFormValues = Partial<{
  // upload
  name: string
  description: string
  category: string
  license: string
  visibility: 'public' | 'private'
  image: string | File
  content: string | File
  // add to collections
  addToCollections: string[]
  // extra
  type: string
  level: string
  month: string
  year: string
  language: string
}>
