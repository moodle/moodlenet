import type { TextOptionProps } from '@moodlenet/component-library'
import type { EdMetaExposeType } from './expose-def.mjs'

export type LearningOutcome = {
  code: string
  verb: string
  sentence: string
}

export type LearningOutcomeOption = {
  name: string
  code: string
  verbs: string[]
}

export type EdMetaEntityNames =
  | 'IscedField'
  | 'IscedGrade'
  | 'Language'
  | 'License'
  | 'EdAssetType'
  | 'BloomCognitive'
export type MyWebDeps = {
  me: EdMetaExposeType
}

export type PublishedMeta = {
  types: TextOptionProps[]
  languages: TextOptionProps[]
  licenses: TextOptionProps[]
  subjects: TextOptionProps[]
  levels: TextOptionProps[]
  learningOutcomes: LearningOutcomeOption[]
}

export type SubjectData = {
  iscedUrl: string | null
  isIsced: boolean
  title: string
}

export type SubjectSearchResultRpc = {
  endCursor?: string
  list: { _key: string }[]
}
export type SortTypeRpc = 'Relevant' | 'Popular' | 'Recent'
export function isSortTypeRpc(_: any): _ is SortTypeRpc {
  return ['Relevant', 'Popular', 'Recent'].includes(_)
}
