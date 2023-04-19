import { PkgExposeDef } from '@moodlenet/core'
import { WebUserProfile } from '../server/types.mjs'
import { ClientSessionDataRpc, WebUserData } from './types.mjs'

export type WebUserExposeType = PkgExposeDef<{
  rpc: {
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
