import type { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import type { Document, EntityDocument } from '@moodlenet/system-entities/server'
import type { KnownEntityFeature } from '../common/types.mjs'

// TODO //@ALE ProfileEntity _meta { webUserKey }

export type KnownFeaturedEntityItem = { _id: string; feature: KnownEntityFeature }
export type ProfileEntity = EntityDocument<ProfileDataType>
export type ProfileDataType = {
  displayName: string
  aboutMe: string | undefined | null
  organizationName: string | undefined | null
  location: string | undefined | null
  siteUrl: string | undefined | null
  backgroundImage: Image | undefined | null
  avatarImage: Image | undefined | null
  knownFeaturedEntities: KnownFeaturedEntityItem[]
  kudos: number
  publisher: boolean
  webslug: string
  popularity?: {
    overall: number
    items: {
      followers?: ProfilePopularityItem
    } & { [key: string]: ProfilePopularityItem }
  }
}
export type ProfilePopularityItem = { value: number }

type Image = ImageUploaded
export type ImageUploaded = { kind: 'file'; directAccessId: string }
// export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

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

export type TokenVersion = 1
export type WebUserJwtPayload = { v: TokenVersion & 1 } & (
  | {
      isRoot: true
    }
  | {
      isRoot?: false
      webUser: Pick<Document<WebUserDataType>, '_key' | 'isAdmin' | 'displayName'>
      profile: Pick<ProfileEntity, '_key' | '_id'>
    }
)

export type WebUserCtxType = {
  tokenCtx?: TokenCtx
}
export type TokenCtx = VerifiedTokenCtx | UnverifiedTokenCtx
export type VerifiedTokenCtx = {
  type: 'verified-token'
  currentJwtToken: JwtToken
  payload: JwtVerifyResult<WebUserJwtPayload>['payload']
}

export type UnverifiedTokenCtx = {
  type: 'unverified-token'
  currentJwtToken: JwtToken
}

export interface WebUserEvents {
  'send-message-to-web-user': {
    message: {
      text: string
      html: string
    }
    webUserKey: string
  }
}
