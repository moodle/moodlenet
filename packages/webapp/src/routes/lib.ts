import { AssetRef } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { getAssetRefUrl } from '@moodlenet/common/lib/staticAsset/lib'
import { GetRouteDefParams, GetRouteDefPath, RouteDef } from '@moodlenet/common/lib/webapp/sitemap'
import * as H from 'history'
import { FC } from 'react'
import { RouteComponentProps } from 'react-router'
import { STATIC_ASSET_BASE } from '../constants'

export type RouteFC<R extends RouteDef<string, any>> = FC<RouteComponentProps<GetRouteDefParams<R>>>

export type MNRouteProps<R extends RouteDef<string, any>> = {
  path: GetRouteDefPath<R>
  component: RouteFC<R>
  location?: H.Location
  exact?: boolean
  sensitive?: boolean
  strict?: boolean
}

export const getJustAssetRefUrl = (assetRef: AssetRef): string =>
  getAssetRefUrl({ assetRef, baseStaticAssetUrl: STATIC_ASSET_BASE })
export const getMaybeAssetRefUrl = (assetRef: AssetRef | null | undefined): null | string =>
  assetRef ? getJustAssetRefUrl(assetRef) : null
