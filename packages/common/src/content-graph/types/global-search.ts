import { Maybe } from '../../utils/types'
import { nodeTypes } from './node'

export const globalSearchSortBy = ['Popularity', 'Relevance', 'Recent'] as const
export type GlobalSearchSortBy = typeof globalSearchSortBy[number]
export type GlobalSearchSort = { by: GlobalSearchSortBy; asc?: Maybe<boolean> }

export const isGlobalSearchSortBy = (_: any): _ is GlobalSearchSortBy => !!_ && globalSearchSortBy.includes(_)

export const globalSearchNodeTypes = nodeTypes.filter((_): _ is GlobalSearchNodeType =>
  ['Collection', 'Resource', 'IscedField'].includes(_),
)
export type GlobalSearchNodeType = 'Collection' | 'Resource' | 'IscedField'

export const isGlobalSearchNodeType = (_: any): _ is GlobalSearchNodeType => !!_ && globalSearchNodeTypes.includes(_)
