import { EdgeType, GlobalSearchSort, NodeType } from '../../graphql/types.graphql.gen'

export type Key = string
export type Id = string

export const globalSearchSort: GlobalSearchSort[] = ['Popularity', 'Relevance', 'Relevance']
export const isGlobalSearchSort = (_: any): _ is GlobalSearchSort => !!_ && globalSearchSort.includes(_)

export const glyphId = (type: EdgeType | NodeType, id: string): Id => `${type}/${id}`

const nodeTypes: NodeType[] = ['Collection', 'Profile', 'Resource', 'Iscedfield', 'Organization']
export const isNodeType = (_: any): _ is NodeType => !!_ && nodeTypes.includes(_)
const edgeTypes: EdgeType[] = ['AppliesTo', 'Contains', 'Created', 'Follows', 'Likes']
export const isEdgeType = (_: any): _ is EdgeType => !!_ && edgeTypes.includes(_)

export const nodeTypeFromCheckedId = (_: Id) => nodeTypeFromUncheckedId(_)!
export const nodeTypeFromUncheckedId = (_: Id): NodeType | null => {
  const [nodeType] = _.split('/')
  return isNodeType(nodeType) ? nodeType : null
}
export const edgeTypeFromCheckedId = (_: Id) => edgeTypeFromUncheckedId(_)!
export const edgeTypeFromUncheckedId = (_: Id): EdgeType => {
  const [edgeType] = _.split('/')
  return edgeType as EdgeType
}

const caseInsensitiveNodeTypesMap = nodeTypes.reduce(
  (_map, NodeType) => ({
    ..._map,
    [NodeType.toLowerCase()]: NodeType,
  }),
  {},
) as {
  [lowertype in Lowercase<NodeType>]: NodeType
}
//console.log({ caseInsensitiveNodeTypesMap })
export const getNodeTypeByCaseInsensitive = (caseInsensitiveNodeType: string) =>
  (caseInsensitiveNodeTypesMap as any)[caseInsensitiveNodeType.toLowerCase()] as NodeType | undefined

export const keyFromUncheckedId = (_: Key): Id | null => {
  const [, key] = _.split('/')
  return key ?? null
}

export const parseCheckedNodeId = (_: Id) => parseUncheckedNodeId(_)!
export const parseUncheckedNodeId = (_: Id): [nodeType: NodeType, id: Key] | null => {
  const nodeType = nodeTypeFromUncheckedId(_)
  const id = keyFromUncheckedId(_)
  if (!(nodeType && id)) {
    return null
  }
  return [nodeType, id]
}
export const parseCheckedEdgeId = (_: Id) => parseUncheckedEdgeId(_)!
export const parseUncheckedEdgeId = (_: Id): [edgeType: EdgeType, id: Key] | null => {
  const edgeType = edgeTypeFromUncheckedId(_)
  const id = keyFromUncheckedId(_)
  if (!(edgeType && id)) {
    return null
  }
  return [edgeType, id]
}

export const parseId = (_: Id): [glyphType: EdgeType | NodeType, id: Key] | null =>
  parseUncheckedEdgeId(_) || parseUncheckedNodeId(_)
export const checkIDIsValidOrError = (_: any) => {
  if (typeof _ !== 'string' || !parseId(_)) {
    throw new Error(`${_} is not a valid Id`)
  }
}

export const parseNodeIdCaseInsensitive = (_: string): [nodeType: NodeType, id: Key, Id: Id] | null => {
  const [type, id] = _.split('/')
  if (!(type && id)) {
    return null
  }
  const nodeType = getNodeTypeByCaseInsensitive(type)
  if (!nodeType) {
    return null
  }
  const Id = `${nodeType}/${id}`
  return [nodeType, id, Id]
}
