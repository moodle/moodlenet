import { EdgeId, GraphEdgeType } from '../../content-graph/types/edge'
import { GraphNodeType, Slug } from '../../content-graph/types/node'

export type GlobalSearchSortBy = 'Relevance' | 'Popularity' | 'Recent'
export const globalSearchSort: GlobalSearchSortBy[] = ['Popularity', 'Relevance', 'Relevance']
export const isGlobalSearchSort = (_: any): _ is GlobalSearchSortBy => !!_ && globalSearchSort.includes(_)

export type GlobalSearchNodeType = 'Collection' | 'Resource' | 'Iscedf'
export const globalSearchNodeType: GlobalSearchNodeType[] = ['Collection', 'Resource', 'Iscedf']
export const isGlobalSearchNodeType = (_: any): _ is GlobalSearchNodeType => !!_ && globalSearchNodeType.includes(_)

export const nodeTypes: GraphNodeType[] = ['Collection', 'Profile', 'Resource', 'Iscedf', 'Organization', 'OpBadge']
export const isGraphNodeType = (_: any): _ is GraphNodeType => !!_ && nodeTypes.includes(_)
export const edgeTypes: GraphEdgeType[] = ['Created', 'HasOpBadge', 'Contains', 'Follows', 'Pinned']
export const isGraphEdgeType = (_: any): _ is GraphEdgeType => !!_ && edgeTypes.includes(_)

export const nodeSlugId = (type: GraphNodeType, slug: Slug) => `${type}/${slug}`

export const parseNodeId = (id: string): [type: GraphNodeType, slug: Slug] | null => {
  const splitted = (id || '').split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [type, slug] = splitted
  if (!(type && slug && isGraphNodeType(type))) {
    return null
  }
  return [type, slug]
}

export const parseEdgeId = (id: string): [type: GraphEdgeType, id: EdgeId] | null => {
  const splitted = (id || '').split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [type, _id] = splitted
  if (!(type && _id && isGraphEdgeType(type))) {
    return null
  }
  return [type, _id]
}
