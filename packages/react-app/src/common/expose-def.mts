import { PkgExposeDef } from '@moodlenet/core'
import { OrganizationData } from '@moodlenet/organization/common'
import { WebUserProfile } from '../server/types.mjs'
import { AppearanceData, ClientSessionDataRpc, WebUserData } from './types.mjs'

export type ReactAppExposeType = PkgExposeDef<{
  rpc: {
    'setOrgData'(body: { orgData: OrganizationData }): Promise<{ valid: boolean }>
    'getOrgData'(): Promise<{ data: OrganizationData }>
    'getAppearance'(): Promise<{ data: AppearanceData }>
    'setAppearance'(body: { appearanceData: AppearanceData }): Promise<{ valid: boolean }>
    'updateAllPkgs'(): Promise<{ updatePkgs: Record<string, string> }>
    'getCurrentClientSessionDataRpc'(): Promise<ClientSessionDataRpc | undefined>
    'loginAsRoot'(body: { rootPassword: string }): Promise<boolean>
    'webapp/profile/edit'(
      body: WebUserProfile,
    ): Promise<{ data: WebUserProfile; canEdit: boolean } | undefined>
    'webapp/profile/get'(body: {
      _key: string
    }): Promise<{ data: WebUserProfile; canEdit: boolean } | undefined>
    'webapp/roles/searchUsers'(body: { search: string }): Promise<WebUserData[]>
    'webapp/roles/toggleIsAdmin'(
      body: { profileKey: string } | { userKey: string },
    ): Promise<boolean>
  }
}>
