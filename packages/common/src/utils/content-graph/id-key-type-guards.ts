import { edgeTypes, GraphEdgeIdentifier, GraphEdgeType } from '../../content-graph/types/edge'
import { GraphNodeIdentifierSlug, GraphNodeType, nodeTypes, Slug } from '../../content-graph/types/node'

export type GlobalSearchSortBy = 'Relevance' | 'Popularity' | 'Recent'
export const globalSearchSort: GlobalSearchSortBy[] = ['Popularity', 'Relevance', 'Relevance']
export const isGlobalSearchSort = (_: any): _ is GlobalSearchSortBy => !!_ && globalSearchSort.includes(_)

export type GlobalSearchNodeType = 'Collection' | 'Resource' | 'IscedField'
export const globalSearchNodeType: GraphNodeType[] = ['Collection', 'Resource', 'IscedField']
export const isGlobalSearchNodeType = (_: any): _ is GlobalSearchNodeType => !!_ && globalSearchNodeType.includes(_)

export const isGraphNodeType = (_: any): _ is GraphNodeType => !!_ && nodeTypes.includes(_)
export const isGraphEdgeType = (_: any): _ is GraphEdgeType => !!_ && edgeTypes.includes(_)

export const nodeSlugId = (type: GraphNodeType, slug: Slug) => `${type}/${slug}`

export const gqlNodeId2GraphNodeIdentifier = (_id: string): GraphNodeIdentifierSlug | null => {
  const splitted = (_id || '').split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [_type, _slug] = splitted
  if (!(_type && _slug && isGraphNodeType(_type))) {
    return null
  }
  return { _type, _slug }
}
export const gqlNodeId2GraphNodeIdentifierOfType = <NT extends GraphNodeType = GraphNodeType>(
  _id: string,
  ofType: NT,
): GraphNodeIdentifierSlug<NT> | null => {
  const identifier = gqlNodeId2GraphNodeIdentifier(_id)
  if (!identifier) {
    return null
  }
  const { _slug, _type } = identifier
  if (ofType !== _type) {
    return null
  }
  return { _slug, _type: ofType }
}

export const gqlEdgeId2GraphEdgeIdentifier = (_id: string): GraphEdgeIdentifier | null => {
  const splitted = _id.split('/')
  if (splitted.length !== 2) {
    return null
  }
  const [_type, id] = splitted
  if (!(_type && id && isGraphEdgeType(_type))) {
    return null
  }
  return { _type, id }
}
