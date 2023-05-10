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
    'webapp/get-profile-entity-ids/:profileKey'(
      body: void,
      params: { profileKey: string },
    ): Promise<{ _id: string }[]>

    // social features
    'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'(
      body: void,
      params: {
        action: 'add' | 'remove'
        feature: 'bookmark' | 'follow' | 'like'
        entity_id: string
      },
    ): Promise<void>
    'webapp/feature-entity/count/:feature(bookmark|follow|like)/:entity_id'(
      body: void,
      params: {
        feature: 'bookmark' | 'follow' | 'like'
        entity_id: string
      },
    ): Promise<{ count: number }>
    'webapp/all-my-featured-entities'(): Promise<{
      entities: { _id: string }[]
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
