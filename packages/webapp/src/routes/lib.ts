import { AssetRef } from '@moodlenet/common/lib/pub-graphql/types'
import { GetRouteDefParams, GetRouteDefPath, RouteDef } from '@moodlenet/common/lib/webapp/sitemap'
import * as H from 'history'
import { FC } from 'react'
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

export const getLocalAssetUrl = (assetId: string): string => `/static/${assetId}` //FIXME: should `/asset/*` be in config ?
export const getAssetRefUrl = (assetRef: AssetRef | null | undefined): string | null => {
  if (!assetRef) {
    return null
  }
  const { location, ext } = assetRef
  return ext ? location : getLocalAssetUrl(location)
}
