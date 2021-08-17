import { GraphNodeType, nodeTypes } from '../../content-graph/types/node'
import { NodeType } from '../../graphql/types.graphql.gen'

// TODO: should this stuff go to common/graphql/helpers.ts ?

const nodeType2LowerTypeMap = nodeTypes.reduce(
  (_map, nodeType) => ({
    ..._map,
    [nodeType.toLowerCase()]: nodeType,
  }),
  {},
) as {
  [lowertype in Lowercase<GraphNodeType>]: GraphNodeType
}

const lowerType2NodeTypeMap = nodeTypes.reduce(
  (_map, nodeType) => ({
    ..._map,
    [nodeType]: nodeType.toLowerCase(),
  }),
  {},
) as {
  [type in GraphNodeType]: Lowercase<GraphNodeType>
}

export const getNodeTypeByCaseInsensitive = (caseInsensitiveNodeType: string) =>
  (nodeType2LowerTypeMap as any)[caseInsensitiveNodeType.toLowerCase()] as GraphNodeType | undefined

export const nodeGqlId2UrlPath = (id: string) => {
  const [_type, _slug] = id.split('/')

  return nodeIdentifierSlug2UrlPath({ _type: String(_type) as NodeType, _slug: _slug! })
}
export const nodeIdentifierSlug2UrlPath = ({ _slug, _type }: { _slug: string; _type: NodeType }) => {
  const lowerCaseType = (lowerType2NodeTypeMap as any)[_type]
  // console.log({ id, type, slug, lowerCaseType, caseInsensitiveNodeTypesMap: nodeType2LowerTypeMap })
  return `/${lowerCaseType}/${_slug}`
}
