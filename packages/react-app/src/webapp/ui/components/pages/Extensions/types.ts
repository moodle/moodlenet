export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'Public' | 'Private'
  image?: string | File | null
}
