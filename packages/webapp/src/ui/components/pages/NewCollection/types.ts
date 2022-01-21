export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'public' | 'private'
  image: string | File | null
}
