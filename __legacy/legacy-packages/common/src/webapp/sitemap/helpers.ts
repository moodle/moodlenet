import { GraphNodeIdentifierSlug, GraphNodeType } from '../../content-graph/types/node'

// todo: should this stuff go to common/graphql/helpers.ts ?

const NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH = 'no-home'
const contentNodeType2NodeHomePagePathsMap: Record<GraphNodeType, string> = {
  Profile: 'profile',
  Resource: 'resource',
  Collection: 'collection',
  IscedField: 'subject',
  FileFormat: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
  IscedGrade: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
  Language: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
  License: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
  Organization: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
  ResourceType: NOT_IMPLEMENTED_CONTENT_NODE_HOME_PATH,
}

const nodeHomePagePathsMap2ContentNodeType: Record<string, GraphNodeType> = Object.entries(
  contentNodeType2NodeHomePagePathsMap,
).reduce(
  (_map, [graphNodeType, path]) =>
    path
      ? {
          ..._map,
          [path]: graphNodeType,
        }
      : _map,
  {},
)
// const nodeType2LowerTypeMap = nodeTypes.reduce(
//   (_map, nodeType) => ({
//     ..._map,
//     [nodeType.toLowerCase()]: nodeType,
//   }),
//   {},
// ) as {
//   [lowertype in Lowercase<GraphNodeType>]: GraphNodeType
// }

// const lowerType2NodeTypeMap = nodeTypes.reduce(
//   (_map, nodeType) => ({
//     ..._map,
//     [nodeType]: nodeType.toLowerCase(),
//   }),
//   {},
// ) as {
//   [type in GraphNodeType]: Lowercase<GraphNodeType>
// }

export const getNodeTypeByCaseInsensitiveContentNodePath = (
  caseInsensitiveContentNodePath: string,
) => nodeHomePagePathsMap2ContentNodeType[caseInsensitiveContentNodePath.toLowerCase()]

export const nodeGqlId2UrlPath = (id: string) => {
  const [_type, _slug] = id.split('/')
  // console.log({ _type, _slug })

  return nodeIdentifierSlug2HomeUrlPath({
    _type: String(_type) as GraphNodeType,
    _slug: String(_slug),
  })
}
export const nodeIdentifierSlug2HomeUrlPath = (slugId: GraphNodeIdentifierSlug) => {
  if (slugId._type === 'Organization') {
    return '' // !FIXME: for federation !! ;)
  }
  const { _slug, _type } = slugId
  const contentNodeHomePath = getContentNodeHomePageBasePath(_type)
  const contentNodeHomePathSlug = `${contentNodeHomePath}/${_slug}`
  // console.log({ _type, _slug, contentNodeHomePath, contentNodeHomePathSlug })
  return contentNodeHomePathSlug
}
export const getContentNodeHomePageRoutePath = (nodeType: GraphNodeType) => {
  const contentNodeHomePageRoutePath = `${getContentNodeHomePageBasePath(
    nodeType,
  )}/:slug` as `/${string}/:slug`
  // console.log({ nodeType, contentNodeHomePageRoutePath })
  return contentNodeHomePageRoutePath
}

export const getContentNodeHomePageBasePath = (nodeType: GraphNodeType) =>
  `/${contentNodeType2NodeHomePagePathsMap[nodeType]}`
