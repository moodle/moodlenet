import { GraphEdgeType } from '../../content-graph/types/edge'
import { GraphNodeType } from '../../content-graph/types/node'

export type GlobalSearchSortBy = 'Relevance' | 'Popularity' | 'Recent'
export const globalSearchSort: GlobalSearchSortBy[] = ['Popularity', 'Relevance', 'Relevance']
export const isGlobalSearchSort = (_: any): _ is GlobalSearchSortBy => !!_ && globalSearchSort.includes(_)

export type GlobalSearchNodeType = 'Collection' | 'Resource' | 'Iscedf'
export const globalSearchNodeType: GlobalSearchNodeType[] = ['Collection', 'Resource', 'Iscedf']
export const isGlobalSearchNodeType = (_: any): _ is GlobalSearchNodeType => !!_ && globalSearchNodeType.includes(_)

const nodeTypes: GraphNodeType[] = ['Collection', 'Profile', 'Resource', 'Iscedf', 'Organization', 'OpBadge']
export const isGraphNodeType = (_: any): _ is GraphNodeType => !!_ && nodeTypes.includes(_)
const edgeTypes: GraphEdgeType[] = ['Created', 'HasOpBadge']
export const isGraphEdgeType = (_: any): _ is GraphEdgeType => !!_ && edgeTypes.includes(_)

const caseInsensitiveNodeTypesMap = nodeTypes.reduce(
  (_map, NodeType) => ({
    ..._map,
    [NodeType.toLowerCase()]: NodeType,
  }),
  {},
) as {
  [lowertype in Lowercase<GraphNodeType>]: GraphNodeType
}

export const getNodeTypeByCaseInsensitive = (caseInsensitiveNodeType: string) =>
  (caseInsensitiveNodeTypesMap as any)[caseInsensitiveNodeType.toLowerCase()] as GraphNodeType | undefined
