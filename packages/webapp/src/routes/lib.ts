import * as H from 'history'
import { FC } from 'react'
import { RouteDef, GetRouteDefParams, GetRouteDefPath } from '../../../common/lib/webapp/sitemap'
import { RouteComponentProps } from 'react-router'

export type RouteFC<R extends RouteDef<string, any>> = FC<RouteComponentProps<GetRouteDefParams<R>>>

export type MNRouteProps<R extends RouteDef<string, any>> = {
  path: GetRouteDefPath<R>
  component: RouteFC<R>
  location?: H.Location
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
}
