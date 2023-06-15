import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type {
  ClientSessionDataRpc,
  KnownEntityFeature,
  KnownEntityType,
  KnownFeaturedEntities,
  Profile,
  ProfileGetRpc,
  ProfileSearchResultRpc,
  SortTypeRpc,
  WebUserData,
} from './types.mjs'
export type { EntityIdentifier } from '@moodlenet/system-entities/common'

export type WebUserExposeType = PkgExposeDef<{
  rpc: {
    'getCurrentClientSessionDataRpc'(): Promise<ClientSessionDataRpc | undefined>
    'loginAsRoot'(body: { rootPassword: string }): Promise<boolean>
    'webapp/profile/edit'(body: Omit<Profile, 'avatarUrl' | 'backgroundUrl'>): Promise<void>
    'webapp/profile/get'(body: { _key: string }): Promise<ProfileGetRpc | undefined>
    'webapp/roles/searchUsers'(body: { search: string }): Promise<WebUserData[]>
    'webapp/roles/toggleIsAdmin'(
      body: { profileKey: string } | { userKey: string },
    ): Promise<boolean>
    'webapp/upload-profile-background/:_key'(
      body: { file: [RpcFile | null | undefined] },
      params: { _key: string },
    ): Promise<string | null>
    'webapp/upload-profile-avatar/:_key'(
      body: { file: [RpcFile | null | undefined] },
      params: { _key: string },
    ): Promise<string | null>
    'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection|subject)/:_key'(
      body: void,
      params: {
        action: 'add' | 'remove'
        feature: KnownEntityFeature
        entityType: KnownEntityType
        _key: string
      },
    ): Promise<void>
    'webapp/feature-entity/count/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key'(
      body: void,
      params: {
        feature: Exclude<KnownEntityFeature, 'bookmark'>
        entityType: KnownEntityType
        _key: string
      },
    ): Promise<{ count: number }>
    'webapp/all-my-featured-entities'(): Promise<null | {
      featuredEntities: KnownFeaturedEntities
    }>
    'webapp/profile-kudos-count/:profileKey'(
      body: void,
      params: { profileKey: string },
    ): Promise<{ count: number }>
    'webapp/send-message-to-user/:profileKey'(
      body: { message: string },
      params: { profileKey: string },
    ): Promise<void>
    // --
    // LANDING
    'webapp/landing/get-list/:entityType(collections|resources|profiles)'(
      body: void,
      params: {
        entityType: 'collections' | 'resources' | 'profiles'
      },
    ): Promise<{ _key: string }[]>
    'webapp/search'(
      body: undefined,
      params: undefined,
      query: {
        sortType?: SortTypeRpc
        text?: string
        after?: string
        limit?: number
      },
    ): Promise<ProfileSearchResultRpc>
  }
}>
