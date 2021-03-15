import { EdgeType, NodeType } from '../../pub-graphql/types.graphql.gen'
export type IdKey = string //& { readonly __: unique symbol }
// export type Id<N extends NodeType = NodeType> = `${N}/${IdKey}` & { readonly __: unique symbol }
export type Id = string & { readonly __: unique symbol }

export const isIdKey = (_: string | undefined): _ is IdKey => !!_ && true //FIXME: check is ULID
export const isId = (_: string | undefined): _ is Id => {
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

export const isEdgeType = (_: string | undefined): _ is EdgeType => !!_ && _ in EdgeType
export const edgeTypeFromId = (_: Id): EdgeType => {
  const [edgeType] = _.split('/')
  return edgeType as EdgeType
}

export const isNodeType = (_: string | undefined): _ is NodeType => !!_ && _ in NodeType
export const nodeTypeFromId = (_: Id): NodeType => {
  const [nodeType] = _.split('/')
  return nodeType as NodeType
}

export const idKeyFromId = (_: Id): IdKey => {
  const [, key] = _.split('/')
  return key as IdKey
}

export const capitalizeNodeType = (_: string): NodeType | null => {
  const type = _ && _[0].toUpperCase() + _.substr(1)
  if (!(type && isNodeType(type))) {
    return null
  }
  return type
}

export const parseNodeId = (_: Id): { nodeType: NodeType; _key: IdKey } => ({
  nodeType: nodeTypeFromId(_),
  _key: idKeyFromId(_),
})
export const parseNodeIdString = (_: string): { nodeType: NodeType; _key: IdKey; id: Id } | null => {
  const [type, _key] = _.split('/')
  const nodeType = capitalizeNodeType(type)
  if (!(nodeType && isIdKey(_key))) {
    return null
  }
  return { nodeType, _key, id: `${nodeType}/${_key}` as Id }
}

export const parseEdgeId = (_: Id): { edgeType: EdgeType; _key: IdKey } => ({
  edgeType: edgeTypeFromId(_),
  _key: idKeyFromId(_),
})
