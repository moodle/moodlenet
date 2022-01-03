// import { NewResourceFormValues } from "../NewResource/types"

export type Url = string
export type Category = string
export type Visibility = string
export type NewCollectionFormValues = {
  title: string
  description: string
  visibility: Visibility
  // category: Category
  image: Url | File | null
  imageUrl: Url | null
  // resources: Pick<NewResourceFormValues, 'title' | 'type' | 'image' | 'description'>[]
}

export type NewCollectionFormValuesNew = {
  title: string
  description: string
  published: Visibility
  image: Url | File | null
  imageUrl: Url | null
}
