import { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import { EntityDocument } from '@moodlenet/system-entities/server'

// ALE:
// TODO: WebUserProfileEntity _meta { webUserKey }
export type WebUserProfileEntity = EntityDocument<WebUserProfileDataType>
export type WebUserProfileDataType = {
  displayName: string
  aboutMe: string
  organizationName: string | undefined
  location: string | undefined
  siteUrl: string | undefined
}

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
