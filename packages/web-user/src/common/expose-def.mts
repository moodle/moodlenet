import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type { EntityIdentifier } from '@moodlenet/system-entities/server'
import type { ClientSessionDataRpc, Profile, WebUserData } from './types.mjs'
export type { EntityIdentifier } from '@moodlenet/system-entities/server'

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
    'webapp/entity/:feature/:action'(
      body: { entityId: EntityIdentifier },
      params: { action: 'add' | 'remove'; feature: EntityFeature },
    ): Promise<void>
    'webapp/get-my-featured-entities'(): Promise<{
      [feat in EntityFeature]: { entityId: EntityIdentifier }[]
    }>
    'webapp/entity/:feature/count-all'(
      body: { entityId: EntityIdentifier },
      params: { feature: EntityFeature },
    ): Promise<{ count: number }>
  }
}>
