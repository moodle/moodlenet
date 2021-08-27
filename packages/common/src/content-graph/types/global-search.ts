import { isOneOf } from '../../utils/array'
import { Maybe } from '../../utils/types'

export const globalSearchSortBy = ['Popularity', 'Relevance', 'Recent'] as const
export type GlobalSearchSortBy = typeof globalSearchSortBy[number]
export type GlobalSearchSort = { by: GlobalSearchSortBy; asc?: Maybe<boolean> }

export const globalSearchNodeTypes = ['Collection', 'Resource', 'IscedField'] as const

export type GlobalSearchNodeType = 'Collection' | 'Resource' | 'IscedField'

export const isGlobalSearchNodeType = isOneOf(globalSearchSortBy)
