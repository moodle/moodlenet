import '@moodlenet/react-app/moodlenet-react-app-lib'

export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'Public' | 'Private'
  image?: string | File | null
}
