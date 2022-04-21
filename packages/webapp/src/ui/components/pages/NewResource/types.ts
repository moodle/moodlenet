import { AssetInfo } from '../../../types'
import { Visibility } from '../../atoms/VisibilityDropdown/VisibilityDropdown'

export type NewResourceFormValues = {
  // upload
  name: string
  description: string
  category: string
  content: string | File
  visibility: Visibility
  addToCollections: string[]
  license?: string
  // image?: string | File | null
  image?: AssetInfo | null
  type?: string
  level?: string
  month?: string
  year?: string
  language?: string
}
