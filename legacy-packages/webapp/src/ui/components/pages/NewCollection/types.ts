import { AssetInfo } from '../../../types'

export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: 'Public' | 'Private'
  image?: AssetInfo | null
}
