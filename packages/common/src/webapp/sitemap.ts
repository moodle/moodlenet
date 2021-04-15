import { Id, parseNodeId } from '../utils/content-graph'
import { generatePath } from './sitemap/lib'
import { ContentNode } from './sitemap/routes'
import { GetRouteDefParams, GetRouteDefPath, RouteDef } from './sitemap/types'
export * as Routes from './sitemap/routes'
export * from './sitemap/types'

export const webappPath = <Route extends RouteDef<string, any>>(
  path: GetRouteDefPath<Route>,
  params: GetRouteDefParams<Route>,
) => generatePath(path, params)

export const contentNodeLink = <N extends { id: Id }>(_: N) => {
  const { nodeType, _key: key } = parseNodeId(_.id)
  return webappPath<ContentNode>('/content/:nodeType/:key', { key, nodeType: nodeType.toLowerCase() })
}
