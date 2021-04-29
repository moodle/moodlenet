import { AssetRef } from '@moodlenet/common/lib/pub-graphql/types'
import { getAssetRefUrl as _getAssetRefUrl } from '@moodlenet/common/lib/staticAsset/lib'
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

export const getAssetRefUrl = (assetRef: AssetRef | null | undefined): string | null =>
  _getAssetRefUrl({ assetRef, baseStaticcAssetUrl: STATIC_ASSET_BASE })
