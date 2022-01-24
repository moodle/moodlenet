export type NewCollectionFormValues = Partial<{
  title: string
  description: string
  visibility: 'public' | 'private'
  image: string | File
}>
