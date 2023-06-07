import type { EdMetaExposeType } from './expose-def.mjs'

export type EdMetaEntityNames = 'IscedField' | 'IscedGrade'
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
