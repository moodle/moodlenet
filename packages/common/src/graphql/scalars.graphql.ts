import * as idTypes from '../utils/content-graph/id-key-type-guards'
export type ID = idTypes.Id

export type AssetRef = {
  ext: boolean
  location: string
}

export type DateTime = Date
export type Empty = {}
export type Cursor = string
export type Never = never

export const getScalarsGql = (root: string) => ({
  AssetRef: `${root}/scalars.graphql#AssetRef`,
  ID: `${root}/scalars.graphql#ID`,
  DateTime: `${root}/scalars.graphql#DateTime`,
  Empty: `${root}/scalars.graphql#Empty`,
  Cursor: `${root}/scalars.graphql#Cursor`,
  Never: `${root}/scalars.graphql#Never`,
})
