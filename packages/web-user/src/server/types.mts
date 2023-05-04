import type { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'

// ALE:
// TODO: WebUserProfileEntity _meta { webUserKey }
export type WebUserProfileEntity = EntityDocument<WebUserProfileDataType>
export type WebUserProfileDataType = {
  displayName: string
  aboutMe: string | undefined | null
  organizationName: string | undefined | null
  location: string | undefined | null
  siteUrl: string | undefined | null
  backgroundImage: ImageField | undefined | null
  avatarImage: ImageField | undefined | null
}
type ImageField =
  | { kind: 'file'; directAccessId: string }
  // | { kind: 'url'; url: string }
  | undefined
  | null

export type WebUserProfile = WebUserProfileDataType & { _key: string }

export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  profileKey: string
}

export type Contacts = {
  email?: string
}

export type CreateRequest = Pick<WebUserDataType, 'contacts' | 'isAdmin'> & WebUserProfileDataType

export type WebUserJwtPayload =
  | {
      isRoot: true
    }
  | {
      isRoot?: false
      webUserKey: string
      profileKey: string
    }

export type WebUserCtxType = {
  tokenCtx?: TokenCtx
}
export type TokenCtx = VerifiedTokenCtx | UnverifiedTokenCtx

export type VerifiedTokenCtx = {
  type: 'verified-token'
  currentJwtToken: JwtToken
  currentWebUser: JwtVerifyResult<WebUserJwtPayload>['payload']
}

export type UnverifiedTokenCtx = {
  type: 'unverified-token'
  currentJwtToken: JwtToken
}
