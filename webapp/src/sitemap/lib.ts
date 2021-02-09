import * as H from 'history'
import { FC } from 'react'
import { ExtractRouteParams, generatePath, RouteComponentProps } from 'react-router'

export type RouteDef<Path extends string, Params extends ExtractRouteParams<Path>> = {
  path: Path
  params: Params
}

export type GetRouteDefParams<R extends RouteDef<string, any>> = R['params']
export type GetRouteDefPath<R extends RouteDef<string, any>> = R['path']

export type RouteFC<R extends RouteDef<string, any>> = FC<RouteComponentProps<GetRouteDefParams<R>>>

export type MNRouteProps<R extends RouteDef<string, any>> = {
  path: GetRouteDefPath<R>
  component: RouteFC<R>
  location?: H.Location
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
}

export const mnPath = <Route extends RouteDef<string, any>>(
  path: GetRouteDefPath<Route>,
  params: GetRouteDefParams<Route>,
) => generatePath<GetRouteDefPath<Route>>(path, params)
