import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import type { OrganizationData } from '@moodlenet/organization/common'
import type { AppearanceData } from '@moodlenet/react-app/common'
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
import type { ValidationsConfig } from './validationSchema.mjs'
export type { EntityIdentifier } from '@moodlenet/system-entities/common'

export type WebappConfigsRpc = { validations: ValidationsConfig }
export type EditProfileDataRpc = Omit<Profile, 'avatarUrl' | 'backgroundUrl' | '_key'>
export type WebUserExposeType = PkgExposeDef<{
  rpc: {
    'webapp/get-configs'(): Promise<WebappConfigsRpc>
    'getCurrentClientSessionDataRpc'(): Promise<ClientSessionDataRpc | undefined>
    'loginAsRoot'(body: { rootPassword: string }): Promise<boolean>
    'webapp/profile/:_key/edit'(
      body: { editData: EditProfileDataRpc },
      params: { _key: string },
    ): Promise<void>
    'webapp/profile/:_key/get'(body: void, params: { _key: string }): Promise<ProfileGetRpc | null>
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
    'webapp/feature-entity/profiles/:feature(follow|like)/:entityType(profile|collection|resource|subject)/:_key'(
      body: void,
      params: {
        feature: Exclude<KnownEntityFeature, 'bookmark'>
        entityType: KnownEntityType
        _key: string
      },
      query: {
        // sortType?: SortTypeRpc
        after?: string
        limit?: number
      },
    ): Promise<{ profiles: { _key: string }[] }>
    'webapp/all-my-featured-entities'(): Promise<null | {
      featuredEntities: KnownFeaturedEntities
    }>
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
      q: { limit: number },
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
    'webapp/web-user/delete-account-request'(): Promise<void>
    'webapp/admin/general/set-org-data'(body: {
      orgData: OrganizationData
    }): Promise<{ valid: boolean }>
    'webapp/react-app/get-org-data'(): Promise<{ data: OrganizationData }>
    'webapp/react-app/get-appearance'(): Promise<{ data: AppearanceData }>
    'webapp/admin/general/set-appearance'(body: {
      appearanceData: AppearanceData
    }): Promise<{ valid: boolean }>
    'webapp/admin/packages/update-all-pkgs'(): Promise<{ updatePkgs: Record<string, string> }>
  }
}>
