import type { EdMetaExposeType } from './expose-def.mjs'

export type EdMetaEntityNames = 'IscedField' | 'IscedGrade' | 'Language' | 'License' | 'EdAssetType'
export type MyWebDeps = {
  me: EdMetaExposeType
}

export type Subject = { label: string; value: string }
export type Level = { label: string; value: string }
export type Type = { label: string; value: string }
export type Langauge = { label: string; value: string }
export type License = { label: string; value: string }
export type PublishedMeta = {
  types: Type[]
  languages: Langauge[]
  licenses: License[]
  subjects: Subject[]
  levels: Level[]
}

export type SubjectData = {
  iscedUrl: string | null
  isIsced: boolean
  title: string
  numFollowers: number
  numResources: number
}

export type SubjectSearchResultRpc = {
  endCursor?: string
  list: { _key: string }[]
}
export type SortTypeRpc = 'Relevant' | 'Popular' | 'Recent'
export function isSortTypeRpc(_: any): _ is SortTypeRpc {
  return ['Relevant', 'Popular', 'Recent'].includes(_)
}
