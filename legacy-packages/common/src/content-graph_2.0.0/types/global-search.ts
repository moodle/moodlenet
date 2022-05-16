import { isOneOf } from '../../utils/array'
import { Maybe } from '../../utils/types'

export const globalSearchSortBy = ['Popularity', 'Relevance', 'Recent'] as const
export type GlobalSearchSortBy = typeof globalSearchSortBy[number]
export const isGlobalSearchSortBy = isOneOf(globalSearchSortBy)
export type GlobalSearchSort = { by: GlobalSearchSortBy; asc?: Maybe<boolean> }

export const globalSearchNodeTypes = [
  'Collection',
  'Resource',
  'IscedField',
  'Profile',
  'License',
  'Organization',
  'Language',
  'IscedGrade',
  'ResourceType',
] as const

export type GlobalSearchNodeType =
  | 'Collection'
  | 'Resource'
  | 'IscedField'
  | 'Profile'
  | 'License'
  | 'Organization'
  | 'Language'
  | 'IscedGrade'
  | 'ResourceType'

export const isGlobalSearchNodeType = isOneOf(globalSearchNodeTypes)
