export type AssetRef = {
  ext: boolean
  location: string
  mimetype: string
}

export type Timestamp = number
export type Empty = {}
export type Cursor = string
export type Never = never
export type ID = string

export const getScalarsGql = (root: string) => ({
  AssetRef: `${root}/scalars.graphql#AssetRef`,
  ID: `${root}/scalars.graphql#ID`,
  Timestamp: `${root}/scalars.graphql#Timestamp`,
  Empty: `${root}/scalars.graphql#Empty`,
  Cursor: `${root}/scalars.graphql#Cursor`,
  Never: `${root}/scalars.graphql#Never`,
})
