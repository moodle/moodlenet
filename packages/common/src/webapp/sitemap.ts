import { generatePath } from './sitemap/lib'
import { GetRouteDefParams, GetRouteDefPath, RouteDef } from './sitemap/types'
export * as Routes from './sitemap/routes'
export * from './sitemap/types'

export const webappPath = <Route extends RouteDef<string, any>>(
  path: GetRouteDefPath<Route>,
  params: GetRouteDefParams<Route>,
) => generatePath(path, params)
