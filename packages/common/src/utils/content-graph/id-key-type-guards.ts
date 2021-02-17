import { EdgeType, NodeType } from '../../pub-graphql/types.graphql.gen'
export type IdKey = string //& { readonly __: unique symbol }
// export type Id<N extends NodeType = NodeType> = `${N}/${IdKey}` & { readonly __: unique symbol }
export type Id = string & { readonly __: unique symbol }

// export const isIdKey = (_: string): _ is IdKey => true //FIXME: check is ULID
export const isId = (_: string): _ is Id => {
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

export const isEdgeType = (_: string): _ is EdgeType => _ in EdgeType
export const edgeTypeFromId = (_: Id): EdgeType => {
  const [edgeType] = _.split('/')
  return edgeType as EdgeType
}

export const isNodeType = (_: string): _ is NodeType => _ in NodeType
export const nodeTypeFromId = (_: Id): NodeType => {
  const [nodeType] = _.split('/')
  return nodeType as NodeType
}
