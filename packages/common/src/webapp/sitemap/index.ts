import { generatePath } from './lib'
import { GetRouteDefParams, GetRouteDefPath, RouteDef } from './types'
export * from './types'
export * as Routes from './routes'

export const webappPath = <Route extends RouteDef<string, any>>(
  path: GetRouteDefPath<Route>,
  params: GetRouteDefParams<Route>,
) => generatePath(path, params)
