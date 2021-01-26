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
  return edgeType in Object.values(EdgeType) ? (edgeType as EdgeType) : null
}

export const nodeTypeFromId = (_: string) => {
  const [nodeType] = _.split('/')
  return nodeType in Object.values(NodeType) ? (nodeType as NodeType) : null
}

export const fromToByIds = ({
  from,
  to,
}: {
  from: string
  to: string
}): [NodeType, NodeType] | null => {
  const _from = nodeTypeFromId(from)
  const _to = nodeTypeFromId(to)
  return _from && _to && [_from, _to]
}

export const bindString = ({
  edgeType,
  from,
  to,
}: {
  edgeType: EdgeType
  from: string
  to: string
}) => `${nodeTypeFromId(from)} ${edgeType} ${nodeTypeFromId(to)}`

export const edgeDataMustBePresentMessage = (edgeType: EdgeType) =>
  `"${edgeType}" must be present in "edge" argument`

export const cantBindMessage = ({
  edgeType,
  from,
  to,
}: {
  edgeType: EdgeType
  from: string
  to: string
}) => `can't bind ${bindString({ edgeType, from, to })}`
