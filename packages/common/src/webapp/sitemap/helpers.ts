import { GraphNodeIdentifierSlug, GraphNodeType, nodeTypes } from '../../content-graph/types/node'

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

//FIXME : rename to nodeGqlId2UrlPath
export const nodeId2UrlPath = (id: string) => {
  const [type, slug] = id.split('/')
  const lowerCaseType = (lowerType2NodeTypeMap as any)[type!]
  // console.log({ id, type, slug, lowerCaseType, caseInsensitiveNodeTypesMap: nodeType2LowerTypeMap })
  return `/${lowerCaseType}/${slug}`
}
export const nodeIdentifierSlug2UrlPath = ({ _slug, _type }: GraphNodeIdentifierSlug) => {
  const lowerCaseType = (lowerType2NodeTypeMap as any)[_type!]
  // console.log({ id, type, slug, lowerCaseType, caseInsensitiveNodeTypesMap: nodeType2LowerTypeMap })
  return `/${lowerCaseType}/${_slug}`
}
