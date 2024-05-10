import type { CollectionDataType, CollectionMeta } from '@moodlenet/collection/server'
import type { EventPayload } from '@moodlenet/core'
import type { JwtToken, JwtVerifyResult } from '@moodlenet/crypto/server'
import type { IscedFieldDataType } from '@moodlenet/ed-meta/server'
import type { EventResourceMeta, ResourceDataType } from '@moodlenet/ed-resource/server'
import type { EntityIdentifier } from '@moodlenet/system-entities/common'
import type {
  Document,
  DocumentMetadata,
  EntityDocument,
  EntityFullDocument,
  EntityUser,
} from '@moodlenet/system-entities/server'
import type {
  KnownEntityFeature,
  KnownEntityType,
  ReportOptionTypeId,
  ReportProfileReasonName,
  UserStatus,
} from '../common/types.mjs'

// TODO //@ALE ProfileEntity _meta { webUserKey }

export type KnownFeaturedEntityItem = {
  _id: string
  _key: string
  entityType: KnownEntityType
  feature: KnownEntityFeature
  at: string
}
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
  publisher: boolean
  webslug: string
  settings: ProfileSettings
  points?: null | number
  deleted?: boolean
  popularity?: null | {
    overall: number
    items: {
      followers?: ProfilePopularityItem
    } & { [key: string]: ProfilePopularityItem }
  }
  publishedContributions: {
    resources: number
    collections: number
  }
}

export type EntityPointsDataType = {
  entityType: KnownEntityType
  entityKey: string
  synced: boolean
  popularity?: null | {
    overall: number
    items: {
      [itemName in string]: number
    }
  }
  points?: null | number
}

export type ProfilePopularityItem = { value: number }

type Image = ImageUploaded
export type ImageUploaded = { kind: 'file'; directAccessId: string }
// export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }

// export type Profile = ProfileDataType & { _key: string }

export type ReportItem = {
  date: string
  reporterWebUserKey: string
  reportTypeId: ReportOptionTypeId
  comment: string
}
export type UserStatusItem = {
  status: UserStatus
  date: string
  byWebUserKey: string
}
export type WebUserRecord = WebUserDataType & DocumentMetadata
export type WebUserDataType = {
  displayName: string
  contacts: Contacts
  isAdmin: boolean
  publisher: boolean
  profileKey: string
  deleting?: boolean
  deleted?: boolean
  moderation: {
    reports: {
      items: ReportItem[]
      amount: number
      mainReasonName: null | ReportProfileReasonName
    }
    status: {
      history: UserStatusItem[]
    }
  }
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
export type ActivityLogDataType = EventPayload<WebUserActivityEvents> & {
  ulid: string
  digested: boolean
}

export type WebUserActivityEvents = {
  'resource-downloaded': {
    resourceKey: string
    userId: EntityIdentifier
    // resource: EntityFullDocument<ResourceDataType>
  }
  'resource-created': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'resource-updated-meta': {
    resourceKey: string
    userId: EntityIdentifier
    meta: EventResourceMeta
    oldMeta: EventResourceMeta
  }
  'resource-published': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'resource-request-metadata-generation': {
    resourceKey: string
    userId: EntityIdentifier
  }
  'resource-unpublished': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }
  'resource-deleted': {
    userId: EntityIdentifier
    resource: EntityFullDocument<ResourceDataType>
  }

  'collection-created': {
    userId: EntityIdentifier
    collection: EntityFullDocument<CollectionDataType>
  }
  'collection-updated-meta': {
    collectionKey: string
    userId: EntityIdentifier
    oldMeta: CollectionMeta
    meta: CollectionMeta
  }
  'collection-published': {
    userId: EntityIdentifier
    collection: EntityFullDocument<CollectionDataType>
    // resourceListInfo: ResourceInCollectionInfo[]
  }
  'collection-resource-list-curation': {
    collection: EntityFullDocument<CollectionDataType>
    action: 'add' | 'remove'
    resource: EntityFullDocument<ResourceDataType>
    userId: EntityIdentifier
  }
  'collection-unpublished': {
    userId: EntityIdentifier
    collection: EntityFullDocument<CollectionDataType>
    // resourceListInfo: ResourceInCollectionInfo[]
  }
  'collection-deleted': {
    userId: EntityIdentifier
    collection: EntityFullDocument<CollectionDataType>
  }

  'created-web-user-account': {
    webUserKey: string
    profileKey: string
    // profile: EntityFullDocument<ProfileDataType>
    // webUser: WebUserRecord
  }
  'user-publishing-permission-change': {
    type: 'given' | 'revoked'
    moderator: EntityUser //| PkgUser
    profile: EntityFullDocument<ProfileDataType>
  }
  'feature-entity': {
    profile: EntityFullDocument<ProfileDataType>
    action: 'add' | 'remove'
    item: KnownFeaturedEntityItem
    targetEntityDoc: EntityFullDocument<
      ProfileDataType | ResourceDataType | CollectionDataType | IscedFieldDataType
    >
  }
  'edit-profile-interests': {
    profileKey: string
    profileInterests: ProfileInterests
    oldProfileInterests: ProfileInterests | null
  }
  'edit-profile-meta': {
    profileKey: string
    meta: ProfileMeta
    oldMeta: ProfileMeta
  }
  ///
  'request-send-message-to-web-user': {
    message: string
    fromWebUserKey: string
    toWebUserKey: string
  }
  'web-user-delete-account-intent': {
    actionUrl: string
    webUserKey: string
  }
  'deleted-web-user-account': {
    displayName: string
    profile: EntityFullDocument<ProfileDataType>
    webUser: WebUserRecord
    leftResources: { _key: string }[]
    leftCollections: { _key: string }[]
    deletedCollections: { _key: string }[]
    deletedResources: { _key: string }[]
  }
  'web-user-logged-in': {
    webUserKey: string
    profileKey: string
  }
  //
  'web-user-reported': {
    targetWebUserKey: string
    reporterWebUserKey: string
    comment: string
    reportOptionTypeId: ReportOptionTypeId
  }
}
