import { EdgeType, NodeType } from '../ContentGraph.graphql.gen'
import { Id, IdKey } from './types'

export const isIdKey = (_: string): _ is IdKey => true //FIXME: check is ULID
export const isId = (_: string): _ is Id => {
  const split = _.split('/')
  const [type, key] = split
  if (split.length !== 2) {
    return false
  }
  if (!(type in NodeType || type in EdgeType)) {
    return false
  }
  return isIdKey(key)
}

export const edgeTypeFromId = (_: string) => {
  const [edgeType] = _.split('/')
  return isId(_) && edgeType in Object.values(EdgeType)
    ? (edgeType as EdgeType)
    : null
}

export const nodeTypeFromId = (_: string) => {
  const [nodeType] = _.split('/')
  return isId(_) && nodeType in Object.values(NodeType)
    ? (nodeType as NodeType)
    : null
}

export const fromToByIds = (_: {
  from: string
  to: string
}): [NodeType, NodeType] | null => {
  const { from, to } = _
  const _from = nodeTypeFromId(from)
  const _to = nodeTypeFromId(to)
  return _from && _to && [_from, _to]
}
