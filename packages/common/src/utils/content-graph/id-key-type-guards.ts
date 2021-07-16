//TODO: review all parse|extraction return types to make them stricter

import { EdgeType, GlobalSearchSort, NodeType } from '../../graphql/types.graphql.gen'
// export type Id = string // & { readonly __: unique symbol } this leads to tsc errors as it recognizes Id from src/* as different type in respect of from lib/*

export const isIdKey = (_: string | undefined | null): _ is IdKey => !!_ && true //FIXME: proper guard
export const isId = (_: string | undefined | null): _ is Id => {
  if (!_) {
    return false
  }
  const split = _.split('/')
  if (split.length !== 2) {
    return false
  }
  const [type /* , key */] = split
  if (!(isEdgeType(type) || isNodeType(type))) {
    return false
  }
  return true //isIdKey(key)
}

export const makeId = (type: NodeType | EdgeType, key: IdKey): Id => `${type}/${key}` as Id

export const globalSearchSort: GlobalSearchSort[] = ['Popularity', 'Relevance', 'Relevance']
export const isGlobalSearchSort = (_: any): _ is GlobalSearchSort => !!_ && globalSearchSort.includes(_)

const edgeTypes: EdgeType[] = ['AppliesTo', 'Contains', 'Created', 'Follows', 'Likes']
export const isEdgeType = (_: any): _ is EdgeType => !!_ && edgeTypes.includes(_)
export const edgeTypeFromId = (_: Id): EdgeType => {
  const [edgeType] = _.split('/')
  return edgeType as EdgeType
}

const nodeTypes: NodeType[] = ['Collection', 'Profile', 'Resource', 'SubjectField']
export const isNodeType = (_: any): _ is NodeType => !!_ && nodeTypes.includes(_)
const caseInsensitiveNodeTypesMap = nodeTypes.reduce(
  (_map, NodeType) => ({
    ..._map,
    [NodeType.toLowerCase()]: NodeType,
  }),
  {},
) as {
  [lowertype in Lowercase<NodeType>]: NodeType
}
console.log({ caseInsensitiveNodeTypesMap })
export const getNodeTypeByCaseinsensitive = (caseInsensitiveNodeType: string) =>
  (caseInsensitiveNodeTypesMap as any)[caseInsensitiveNodeType.toLowerCase()] as NodeType | undefined

export const nodeTypeFromId = (_: Id): NodeType => {
  const [nodeType] = _.split('/')
  return nodeType as NodeType
}
export const glyphId = (type: EdgeType | NodeType, key: string): Id => `${type}/${key}` as Id

export const idKeyFromId = (_: Id): IdKey => {
  const [, key] = _.split('/')
  return key as IdKey
}

export const parseNodeId = (_: Id): { nodeType: NodeType; _key: IdKey } => ({
  nodeType: nodeTypeFromId(_),
  _key: idKeyFromId(_),
})

export const parseNodeIdString = (_: string): { nodeType: NodeType; _key: IdKey; id: Id } | null => {
  const [type, _key] = _.split('/')
  if (!(type && _key)) {
    return null
  }
  const nodeType = getNodeTypeByCaseinsensitive(type)
  if (!(nodeType && isIdKey(_key))) {
    return null
  }
  return { nodeType, _key, id: `${nodeType}/${_key}` as Id }
}

export const parseEdgeId = (_: Id): { edgeType: EdgeType; _key: IdKey } => ({
  edgeType: edgeTypeFromId(_),
  _key: idKeyFromId(_),
})

export const checkIDOrError = (_?: string) => {
  if (!isId(_)) {
    throw 'invalid ID'
  }
  return _
}

export type IdKey = string //& { readonly __: unique symbol }
export type Id<N extends NodeType = NodeType> = `${N}/${IdKey}` // & { readonly __: unique symbol }
