export type Url = string
export type Category = string
export type NewCollectionFormValues = {
  name: string
  title: string
  description: string
  category: Category
  image: Url | File | null
  //addResources: Resource[]
}
