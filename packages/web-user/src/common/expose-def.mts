import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type {
  ClientSessionDataRpc,
  FeaturedEntity,
  KnownEntityFeature,
  KnownEntityTypes,
  Profile,
  ProfileGetRpc,
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

    // social features
    '_____REMOVE_ME____webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'(
      body: void,
      params: {
        action: 'add' | 'remove'
        feature: KnownEntityFeature
        entity_id: string
      },
    ): Promise<void>

    'webapp/entity-social-actions/:action(add|remove)/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key'(
      body: void,
      params: {
        action: 'add' | 'remove'
        feature: KnownEntityFeature
        entityType: KnownEntityTypes
        _key: string
      },
    ): Promise<void>
    'webapp/entity-social-status/:feature(bookmark|follow|like)/:entityType(resource|profile|collection)/:_key'(
      body: void,
      params: {
        feature: KnownEntityFeature
        entityType: KnownEntityTypes
        _key: string
      },
    ): Promise<boolean>

    'webapp/feature-entity/count/:feature(bookmark|follow|like)/:entity_id'(
      body: void,
      params: {
        feature: KnownEntityFeature
        entity_id: string
      },
    ): Promise<{ count: number }>
    'webapp/all-my-featured-entities'(): Promise<{
      featuredEntities: FeaturedEntity[]
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
  }
}>
