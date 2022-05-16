import {
  GetRouteDefParams,
  GetRouteDefPath,
  RouteDef,
} from '@moodlenet/common/dist/webapp/sitemap'
import * as H from 'history'
import { FC } from 'react'
import { RouteComponentProps } from 'react-router'

export type RouteFC<R extends RouteDef<string, any>> = FC<
  RouteComponentProps<GetRouteDefParams<R>>
>

export type MNRouteProps<R extends RouteDef<string, any>> = {
  path: GetRouteDefPath<R>
  component: RouteFC<R>
  location?: H.Location
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
}
