import type { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import type { EntityDocument } from '@moodlenet/system-entities/server'
import type { KnownEntityFeature } from '../common/types.mjs'

// TODO: ProfileEntity _meta { webUserKey }

export type KnownFeaturedEntityItem = { _id: string; feature: KnownEntityFeature }
export type ProfileEntity = EntityDocument<ProfileDataType>
export type ProfileDataType = {
  displayName: string
  aboutMe: string | undefined | null
  organizationName: string | undefined | null
  location: string | undefined | null
  siteUrl: string | undefined | null
  backgroundImage: ImageField | undefined | null
  avatarImage: ImageField | undefined | null
  knownFeaturedEntities: KnownFeaturedEntityItem[]
  kudos: number
}
type ImageField =
  | { kind: 'file'; directAccessId: string }
  // | { kind: 'url'; url: string }
  | undefined
  | null

// export type Profile = ProfileDataType & { _key: string }

export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  profileKey: string
}

export type Contacts = {
  email?: string
}

export type CreateRequest = Pick<WebUserDataType, 'contacts' | 'isAdmin'> &
  Pick<ProfileDataType, 'displayName'> &
  Partial<ProfileDataType>

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
