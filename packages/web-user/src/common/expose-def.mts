import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type { ClientSessionDataRpc, Profile, WebUserData } from './types.mjs'
export type { EntityIdentifier } from '@moodlenet/system-entities/common'

export type EntityFeature = 'bookmark' | 'follow' | 'like'
export type WebUserExposeType = PkgExposeDef<{
  rpc: {
    'getCurrentClientSessionDataRpc'(): Promise<ClientSessionDataRpc | undefined>
    'loginAsRoot'(body: { rootPassword: string }): Promise<boolean>
    'webapp/profile/edit'(
      body: Omit<Profile, 'avatarUrl' | 'backgroundUrl'>,
    ): Promise<{ data: Profile; canEdit: boolean } | undefined>
    'webapp/profile/get'(body: {
      _key: string
    }): Promise<{ data: Profile; canEdit: boolean } | undefined>
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
    'webapp/get-my-own-resources'(): Promise<{ _key: string }[]>
    'webapp/get-my-own-collections'(): Promise<{ _key: string }[]>

    // social features
    'webapp/:action/follow/:entity/:_key'(
      body: void,
      params: { action: 'add' | 'remove'; entity: 'collection' | 'profile'; _key: string },
    ): Promise<void>
    'webapp/:action/like/:entity/:_key'(
      body: void,
      params: { action: 'add' | 'remove'; entity: 'resource'; _key: string },
    ): Promise<void>
    'webapp/:action/bookmark/:entity/:_key'(
      body: void,
      params: {
        action: 'add' | 'remove'
        entity: 'collection' | 'profile' | 'resource'
        _key: string
      },
    ): Promise<void>
    'webapp/all-my-featured-entities'(): Promise<{
      following: {
        collections: { _key: string }[]
        profiles: { _key: string }[]
      }
      likes: {
        resources: { _key: string }[]
      }
      bookmarked: {
        collections: { _key: string }[]
        profiles: { _key: string }[]
        resources: { _key: string }[]
      }
    }>
    'webapp/followers-count/:entity/:_key'(
      body: void,
      params: { entity: 'collection' | 'profile'; _key: string },
    ): Promise<{ count: number }>
    'webapp/likers-count/resource/:_key'(
      body: void,
      params: { _key: string },
    ): Promise<{ count: number }>
    'webapp/kudos-count/:profileKey'(
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
