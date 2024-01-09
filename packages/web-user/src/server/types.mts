import type { CollectionActivityEvents } from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import type { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import type { ResourceActivityEvents } from '@moodlenet/ed-resource/server'
import type {
  Document,
  DocumentMetadata,
  EntityDocument,
  EntityUser,
  PkgUser,
} from '@moodlenet/system-entities/server'
import type { KnownEntityFeature } from '../common/types.mjs'

// TODO //@ALE ProfileEntity _meta { webUserKey }

export type KnownFeaturedEntityItem = { _id: string; feature: KnownEntityFeature }
export type ProfileEntity = EntityDocument<ProfileDataType>

export type ProfileInterests = {
  items?: {
    subjects: string[]
    licenses: string[]
    levels: string[]
    languages: string[]
  }
  asDefaultFilters?: boolean
}

export interface ProfileSettings {
  interests?: null | ProfileInterests
}

export type ProfileMeta = {
  displayName: string
  aboutMe: string | undefined | null
  organizationName: string | undefined | null
  location: string | undefined | null
  siteUrl: string | undefined | null
  backgroundImage: Image | undefined | null
  avatarImage: Image | undefined | null
}
export type ProfileDataType = ProfileMeta & {
  knownFeaturedEntities: KnownFeaturedEntityItem[]
  kudos: number
  publisher: boolean
  webslug: string
  settings: ProfileSettings
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

export type WebUserRecord = WebUserDataType & DocumentMetadata
export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  profileKey: string
  deleting?: boolean
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
      profile: Pick<ProfileEntity, '_key' | '_id' | 'publisher'>
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

export type WebUserAccountDeletionToken = {
  webUserKey: string
  scope: 'web-user-account-deletion'
}

export type WebUserEvents = WebUserActivityEvents //& {}
export type WebUserActivityEvents = {
  'resource-activity-event': Pick<EventPayload<ResourceActivityEvents>, 'data' | 'event'>
  'collection-activity-event': Pick<EventPayload<CollectionActivityEvents>, 'data' | 'event'>
  'request-send-message-to-web-user': {
    message: {
      text: string
      html: string
    }
    toWebUser: Pick<WebUserRecord, '_key' | 'displayName'>
    subject: string
    title: string
  }
  'deleted-web-user-account': {
    webUserKey: string
    profileKey: string
    displayName: string
    leftResources: { _key: string }[]
    leftCollections: { _key: string }[]
    deletedCollections: { _key: string }[]
    deletedResources: { _key: string }[]
  }
  'created-web-user-account': {
    webUserKey: string
    profileKey: string
  }
  'web-user-logged-in': {
    webUserKey: string
    profileKey: string
  }
  'user-publishing-permission-change': {
    profileKey: string
    type: 'given' | 'revoked'
    moderator: EntityUser | PkgUser
  }
  'feature-entity': {
    profileKey: string
    action: 'add' | 'remove'
    item: KnownFeaturedEntityItem
    currentItemsOfSameType: KnownFeaturedEntityItem[]
  }
  'edit-profile-interests': {
    profileKey: string
    profileInterests: ProfileInterests
  }
  'edit-profile-meta': {
    profileKey: string
    meta: ProfileMeta
  }
}

export type ActivityLogDataType = Pick<EventPayload<WebUserActivityEvents>, 'event' | 'data'> & {
  at: string
  ulid: string
}
