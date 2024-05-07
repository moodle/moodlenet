import type { CollectionDataType } from '@moodlenet/collection/server'
import * as collection from '@moodlenet/collection/server'
import { RpcStatus, type RpcFile } from '@moodlenet/core'
import type { IscedFieldDataType } from '@moodlenet/ed-meta/server'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import * as resource from '@moodlenet/ed-resource/server'
import { ensureUnpublish } from '@moodlenet/ed-resource/server'
import { send } from '@moodlenet/email-service/server'
import { getOrgData } from '@moodlenet/organization/server'
import { webSlug } from '@moodlenet/react-app/common'
import {
  defaultImageUploadMaxSize,
  getWebappUrl,
  webImageResizer,
} from '@moodlenet/react-app/server'
import type { EntityClass } from '@moodlenet/system-entities/common'
import type {
  AccessEntitiesRecordType,
  EntityAccess,
  EntityFullDocument,
} from '@moodlenet/system-entities/server'
import {
  currentEntityVar,
  entityMeta,
  getCurrentSystemUser,
  getEntity,
  isCreatorOfCurrentEntity,
  patchEntity,
  queryEntities,
  searchEntities,
  sysEntitiesDB,
  toaql,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import { messageReceivedEmail } from '../../common/emails/Social/MessageReceivedEmail/MessageReceivedEmail.js'
import type { EditProfileDataRpc } from '../../common/expose-def.mjs'
import type {
  KnownEntityFeature,
  KnownEntityType,
  ReportOptionTypeId,
  SortTypeRpc,
} from '../../common/types.mjs'
import type { ValidationsConfig } from '../../common/validationSchema.mjs'
import { getValidationSchemas } from '../../common/validationSchema.mjs'
import { getProfileHomePageRoutePath } from '../../common/webapp-routes.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { WebUserCollection } from '../init/arangodb.mjs'
import { publicFiles } from '../init/fs.mjs'
import { Profile } from '../init/sys-entities.mjs'
import { shell } from '../shell.mjs'
import type {
  ImageUploaded,
  KnownFeaturedEntityItem,
  ProfileDataType,
  ProfileInterests,
  ProfileMeta,
} from '../types.mjs'
import {
  getEntityClassByKnownEntity,
  getEntityIdByKnownEntity,
  isAllowedKnownEntityFeature,
} from './known-entity-types.mjs'
import {
  getCurrentProfileIds,
  getCurrentWebUserIds,
  getWebUserByProfileKey,
  patchWebUserDisplayName,
  verifyCurrentTokenCtx,
} from './web-user.mjs'

export async function getValidations() {
  const config: ValidationsConfig = {
    imageMaxUploadSize: defaultImageUploadMaxSize,
  }
  const {
    avatarImageValidation,
    backgroundImageValidation,
    displayNameSchema,
    profileValidationSchema,
  } = getValidationSchemas(config)

  return {
    avatarImageValidation,
    backgroundImageValidation,
    displayNameSchema,
    profileValidationSchema,
    config,
  }
}

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> }

export async function editProfile(
  key: string,
  profileMeta: Pick<
    ProfileMeta,
    'aboutMe' | 'displayName' | 'location' | 'organizationName' | 'siteUrl'
  >,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const webUser = await getWebUserByProfileKey({ profileKey: key })
  assert(webUser, `couldn't find associated WebUser for profileKey ${key}`)
  const profileRec = await getProfileRecord(key)
  if (!profileRec) {
    throw RpcStatus('Not Found')
  }
  const editData = profileMeta.displayName
    ? { ...profileMeta, webslug: webSlug(profileMeta.displayName) }
    : profileMeta

  const { profileValidationSchema } = await getValidations()

  const updateWithData: EditProfileDataRpc = {
    aboutMe: editData.aboutMe ?? profileRec.entity.aboutMe ?? '',
    displayName: editData.displayName ?? profileRec.entity.displayName,
    location: editData.location ?? profileRec.entity.location ?? undefined,
    organizationName: editData.organizationName ?? profileRec.entity.organizationName ?? undefined,
    siteUrl: editData.siteUrl ?? profileRec.entity.siteUrl ?? undefined,
  }

  const isValid = await profileValidationSchema.isValid(updateWithData)
  if (!isValid) {
    return false
  }
  const updateRes = await patchEntity(Profile.entityClass, key, editData, opts)

  if (!updateRes) {
    return
  }

  const displayNameChanged = updateRes.old.displayName !== updateRes.patched.displayName
  if (displayNameChanged) {
    await patchWebUserDisplayName({
      _key: webUser._key,
      displayName: updateRes.patched.displayName,
    })
  }

  updateRes.changed &&
    shell.events.emit('edit-profile-meta', {
      profileKey: key,
      oldMeta: getProfileMeta(updateRes.old),
      meta: getProfileMeta(updateRes.patched),
    })

  return updateRes
}

export function getProfileMeta(profileData: ProfileDataType) {
  return {
    aboutMe: profileData.aboutMe,
    avatarImage: profileData.avatarImage,
    backgroundImage: profileData.backgroundImage,
    displayName: profileData.displayName,
    location: profileData.location,
    organizationName: profileData.organizationName,
    siteUrl: profileData.siteUrl,
  }
}

export async function entityFeatureAction({
  profileKey,
  _key,
  action,
  entityType,
  feature,
}: {
  profileKey: string
  action: 'add' | 'remove'
  feature: KnownEntityFeature
  entityType: KnownEntityType
  _key: string
}) {
  const adding = action === 'add'
  adding && assert(isAllowedKnownEntityFeature({ entityType, feature }))

  const targetEntityId = getEntityIdByKnownEntity({ _key, entityType })
  const targetEntityDoc = await (
    await sysEntitiesDB.query<
      EntityFullDocument<
        ProfileDataType | ResourceDataType | CollectionDataType | IscedFieldDataType
      >
    >({
      query: 'RETURN DOCUMENT(@targetEntityId)',
      bindVars: { targetEntityId },
    })
  ).next()
  if (!targetEntityDoc) {
    return
  }
  const profileCreatorIdentifiers = targetEntityDoc._meta.creatorEntityId
    ? WebUserEntitiesTools.getIdentifiersById({
        _id: targetEntityDoc._meta.creatorEntityId,
        type: 'Profile',
      })
    : undefined

  const profileId = WebUserEntitiesTools.getIdentifiersByKey({
    _key: profileKey,
    type: 'Profile',
  })._id
  const iAmCreator = profileCreatorIdentifiers?._id === profileId
  if (adding && (feature === 'like' || feature === 'follow') && iAmCreator) {
    return
  }

  const featuringEntityItem: KnownFeaturedEntityItem = {
    _id: targetEntityId,
    feature,
    at: shell.now().toISOString(),
    _key: targetEntityDoc._key,
    entityType,
  }

  const updateResult = await shell.call(patchEntity)(
    Profile.entityClass,
    profileKey,
    `knownFeaturedEntitiesPatch`,
    {
      postAccessBody: `
        let isPresent = 0 < LENGTH(${currentEntityVar}.knownFeaturedEntities[* FILTER 
                                                                                CURRENT._id == @featuringEntityItem._id
                                                                                && CURRENT.feature == @featuringEntityItem.feature
                                                                            ])
        let knownFeaturedEntitiesPatch = ${
          adding
            ? `/* adding */    isPresent ? {} : { knownFeaturedEntities: SORTED( PUSH( ${currentEntityVar}.knownFeaturedEntities, @featuringEntityItem ) ) }`
            : `/* removing */ !isPresent ? {} : { knownFeaturedEntities: SORTED( ${currentEntityVar}.knownFeaturedEntities[* FILTER 
                                                                                                                                  CURRENT._id != @featuringEntityItem._id
                                                                                                                                  && CURRENT.feature != @featuringEntityItem.feature
                                                                                                                              ]) }`
        }`,
      bindVars: {
        featuringEntityItem,
      },
      //project: { isPresent: 'isPresent' as AqlVal<boolean> },
    },
  )
  assert(updateResult)
  // const wasPresent = !!updateResult.patched.knownFeaturedEntities.find(
  //   ({ _id, feature }) =>
  //     _id === featuringEntityItem._id && feature === featuringEntityItem.feature,
  // )
  // const changed = adding ? !wasPresent : wasPresent
  // console.log(changed, action, feature, _key, updateResult.changed /*, pesentChanged, wasPresent */)
  // changed &&
  shell.events.emit('feature-entity', {
    action,
    profile: updateResult.patched,
    item: featuringEntityItem,
    targetEntityDoc,
  })

  // if (updateResult.patched.publisher) {
  //   await deltaPopularity(adding, {
  //     feature,
  //     profileCreatorIdentifiers,
  //     entityType,
  //     entityKey: _key,
  //   })
  // }
  return updateResult
}

export async function getProfilePointLeaders(): Promise<EntityFullDocument<ProfileDataType>[]> {
  const profiles = await searchProfiles({ limit: 20, sortType: 'Points' })
  return profiles.list.map<EntityFullDocument<ProfileDataType>>(({ entity, meta }) => {
    const fullDoc: EntityFullDocument<ProfileDataType> = { ...entity, _meta: meta }
    return fullDoc
  })
}

export async function changeProfilePublisherPerm({
  profileKey,
  setIsPublisher,
  forceUnpublish,
}: {
  profileKey: string
  setIsPublisher: boolean
  forceUnpublish: boolean
}) {
  // console.log('changeProfilePublisherPerm', {
  //   profileKey,
  //   setIsPublisher,
  //   forceUnpublish,
  // })
  const moderator = await getCurrentSystemUser()
  const moderatorIds = await getCurrentWebUserIds()
  assert(moderator.type === 'entity' && moderatorIds?.isAdmin, 'should be an admin user')

  const [profile, webUser] = await Promise.all([
    getProfileRecord(profileKey),
    getWebUserByProfileKey({ profileKey }),
  ])
  if (!(profile && webUser)) return { type: 'not-found', ok: false }
  if (webUser.publisher === setIsPublisher) return { type: 'no-change', ok: true }

  await Promise.all([
    patchEntity(Profile.entityClass, profileKey, {
      publisher: setIsPublisher,
    }),
    WebUserCollection.update(webUser._key, {
      publisher: setIsPublisher,
      moderation: {
        status: {
          history: [
            {
              byWebUserKey: moderatorIds._key,
              date: shell.now().toISOString(),
              status: setIsPublisher ? 'Publisher' : 'Non-publisher',
            },
            ...webUser.moderation.status.history,
          ],
        },
      },
    }),
  ])

  if (!setIsPublisher) {
    const [collections, resources] = await Promise.all([
      getProfileOwnKnownEntities({ profileKey, knownEntity: 'collection', limit: 100000 }),
      getProfileOwnKnownEntities({ profileKey, knownEntity: 'resource', limit: 100000 }),
    ])
    await Promise.all(
      collections
        .filter(({ entity: { published } }) => published)
        .map(async ({ entity: { _key } }) => {
          await collection.setPublished(_key, false)
          // console.log('unpublished collection', _key)
        }),
    )
    await Promise.all(
      resources.map(async data => {
        await ensureUnpublish({ by: 'data', data }, { onlyIfPublished: !forceUnpublish })
        // console.log('unpublished resource', data.entity._key)
      }),
    )
  }
  // console.log('changeProfilePublisherPerm unpublised all')
  shell.events.emit('user-publishing-permission-change', {
    type: setIsPublisher ? 'given' : 'revoked',
    profile: { ...profile.entity, _meta: profile.meta },
    moderator,
  })
  return { type: 'done', ok: true }
}

export async function getProfileRecord(
  key: string,
  opts?: {
    projectAccess?: EntityAccess[]
    filterOutUnaccessibleFeatured?: boolean
  },
) {
  const record = await getEntity(Profile.entityClass, key, {
    projectAccess: opts?.projectAccess,
  })
  if (!record) {
    return undefined
  }

  if (opts?.filterOutUnaccessibleFeatured) {
    record.entity.knownFeaturedEntities = await filterUserUnaccessibleEntities(
      record.entity.knownFeaturedEntities,
    )
  }

  return record
}

export async function filterUserUnaccessibleEntities<
  KEI extends { _key: string; entityType: KnownEntityType },
>(knownEntityItems: KEI[]): Promise<KEI[]> {
  //https://github.com/moodle/moodlenet/issues/44
  const knownFeaturedEntitiesWithRecord = await Promise.all(
    knownEntityItems.map(async entityItem => {
      const { entityType, _key } = entityItem
      const entityClass = getEntityClassByKnownEntity({ entityType })
      const record = await getEntity(entityClass, _key)
      return [entityItem, record] as const
    }),
  )
  return knownFeaturedEntitiesWithRecord.filter(([, record]) => !!record).map(([item]) => item)
}

export async function getEntityFeaturesCount({
  _key,
  entityType,
  feature,
}: {
  feature: Exclude<KnownEntityFeature, 'bookmark'>
  entityType: KnownEntityType
  _key: string
}) {
  const needle: Pick<KnownFeaturedEntityItem, '_key' | 'entityType' | 'feature'> = {
    _key,
    entityType,
    feature,
  }
  const bindVars = { '@profileCollection': Profile.collection.name, needle }
  const query = `
  FOR profile IN @@profileCollection
  FILTER profile.publisher 
          && @needle._key IN profile.knownFeaturedEntities[*]._key
          && @needle.entityType IN profile.knownFeaturedEntities[*].entityType
          && @needle.feature IN profile.knownFeaturedEntities[*].feature
  COLLECT WITH COUNT INTO count
  RETURN { count } 
  `
  const cursor = await sysEntitiesDB.query<{ count: number }>({
    query,
    bindVars,
  })

  return cursor.next()
}

export async function getEntityFeatureProfiles({
  _key,
  entityType,
  feature,
  paging: { after = '0', limit },
}: {
  feature: Exclude<KnownEntityFeature, 'bookmark'>
  entityType: KnownEntityType
  _key: string
  paging: { after?: string; limit?: number }
}) {
  const needle: Pick<KnownFeaturedEntityItem, '_key' | 'entityType' | 'feature'> = {
    _key,
    entityType,
    feature,
  }
  const skip = Number(after)
  const cursor = await queryEntities(Profile.entityClass, {
    skip,
    limit,
    postAccessBody: `FILTER @needle IN (FOR item in ${currentEntityVar}.knownFeaturedEntities 
                                                                          RETURN { 
                                                                            entityType: item.entityType, 
                                                                            _key:       item._key, 
                                                                            feature:    item.feature
                                                                          })`,
    bindVars: { needle },
  })

  return cursor
}
export async function setProfileAvatar(
  {
    _key,
    rpcFile,
  }: {
    _key: string
    rpcFile: RpcFile | null | undefined
  },
  opts?: {
    noResize?: boolean
  },
) {
  const avatarLogicalFilename = getProfileAvatarLogicalFilename(_key)

  const avatarImage = !rpcFile
    ? null
    : await (async () => {
        const resizedRpcFile = opts?.noResize ? rpcFile : await webImageResizer(rpcFile, 'icon')

        const { directAccessId } = await publicFiles.store(avatarLogicalFilename, resizedRpcFile)

        const imageUploaded: ImageUploaded = { kind: 'file', directAccessId }
        return imageUploaded
      })()

  const patchResult = await patchEntity(Profile.entityClass, _key, {
    avatarImage,
  })
  if (!patchResult) {
    return
  }
  if (!rpcFile) {
    await publicFiles.del(avatarLogicalFilename)
  }
  patchResult.changed &&
    shell.events.emit('edit-profile-meta', {
      profileKey: _key,
      meta: getProfileMeta(patchResult.patched),
      oldMeta: getProfileMeta(patchResult.old),
    })
  return patchResult
}

export async function setProfileBackgroundImage(
  {
    _key,
    rpcFile,
  }: {
    _key: string
    rpcFile: RpcFile | null | undefined
  },
  opts?: {
    noResize?: boolean
  },
) {
  const imageLogicalFilename = getProfileImageLogicalFilename(_key)

  const backgroundImage = !rpcFile
    ? null
    : await (async () => {
        const resizedRpcFile = opts?.noResize ? rpcFile : await webImageResizer(rpcFile, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        const backgroundImage: ImageUploaded = { kind: 'file', directAccessId }
        return backgroundImage
      })()

  const patchResult = await patchEntity(Profile.entityClass, _key, {
    backgroundImage,
  })
  if (!patchResult) {
    return
  }
  if (!backgroundImage) {
    await publicFiles.del(imageLogicalFilename)
  }
  patchResult.changed &&
    shell.events.emit('edit-profile-meta', {
      meta: getProfileMeta(patchResult.patched),
      oldMeta: getProfileMeta(patchResult.old),
      profileKey: _key,
    })
  return patchResult
}
export function getProfileImageLogicalFilename(profileKey: string) {
  return `profile-image/${profileKey}`
}

export function getProfileAvatarLogicalFilename(profileKey: string) {
  return `profile-avatar/${profileKey}`
}

export async function getLandingPageList(
  entity: 'collections' | 'profiles' | 'resources',
  limit: number,
) {
  const entityClass = {
    collections: collection.Collection,
    profiles: Profile,
    resources: resource.Resource,
  }[entity].entityClass
  const cursor = await shell.call(queryEntities)(entityClass, {
    limit,
    preAccessBody: 'SORT RAND()',
  })

  return cursor.all()
}

export async function searchProfiles({
  limit = 20,
  sortType = 'Popular',
  text = '',
  after = '0',
}: {
  sortType?: SortTypeRpc | 'Points'
  text?: string
  after?: string
  limit?: number
}) {
  const sort =
    sortType === 'Points'
      ? `${currentEntityVar}.points DESC
      , rank DESC`
      : sortType === 'Popular'
      ? `${currentEntityVar}.points + ( ${currentEntityVar}.popularity.overall || 0 ) DESC
      , rank DESC`
      : sortType === 'Relevant'
      ? 'rank DESC'
      : sortType === 'Recent'
      ? `${entityMeta(currentEntityVar, 'created')} DESC`
      : 'rank DESC'
  const skip = Number(after)
  const cursor = await shell.call(searchEntities)(
    Profile.entityClass,
    text,
    [{ name: 'displayName', factor: 5 }, { name: 'aboutMe' }],
    {
      limit,
      skip,
      sort,
    },
  )

  const list = await cursor.all()
  return {
    list,
    endCursor: list.length < limit ? undefined : String(skip + list.length),
  }
}

export async function sendMessageToProfileIntent({
  message,
  profileKey,
}: {
  message: string
  profileKey: string
}) {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot || !tokenCtx.payload.webUser) return

  const toWebUser = await getWebUserByProfileKey({ profileKey })
  if (!toWebUser) return
  const fromProfile = (await getProfileRecord(tokenCtx.payload.profile._key))?.entity
  assert(fromProfile)
  const fromWebUser = await getWebUserByProfileKey({ profileKey: fromProfile._key })
  assert(fromWebUser)
  const orgData = await getOrgData()

  shell.events.emit('request-send-message-to-web-user', {
    message,
    toWebUserKey: toWebUser._key,
    fromWebUserKey: fromWebUser._key,
  })

  if (toWebUser.contacts.email) {
    send(
      messageReceivedEmail({
        actionUrl: getWebappUrl(
          getProfileHomePageRoutePath({
            _key: fromProfile._key,
            displayName: fromProfile.displayName,
          }),
        ),
        senderDisplayName: fromProfile.displayName,
        message,
        instanceName: orgData.data.instanceName,
        receiverEmail: toWebUser.contacts.email,
      }),
    )
  }
}

export async function getProfileOwnKnownEntities<
  KT extends Exclude<KnownEntityType, 'profile' | 'subject'>,
>({ profileKey, knownEntity, limit }: { profileKey: string; knownEntity: KT; limit?: number }) {
  const { entityIdentifier: profileIdentifier } = WebUserEntitiesTools.getIdentifiersByKey({
    _key: profileKey,
    type: 'Profile',
  })

  type _ClassType = KT extends 'collection'
    ? EntityClass<CollectionDataType>
    : KT extends 'resource'
    ? EntityClass<ResourceDataType>
    : null
  const entityClass = (
    knownEntity === 'resource'
      ? resource.Resource.entityClass
      : knownEntity === 'collection'
      ? collection.Collection.entityClass
      : null
  ) as _ClassType

  assert(entityClass, `getProfileOwnKnownEntities: unknown knownEntity ${knownEntity}`)
  const list = await (
    await shell.call(queryEntities)(entityClass, {
      limit,
      sort: `${currentEntityVar}._meta.created DESC`,
      preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
    })
  ).all()
  return list as KT extends 'collection'
    ? AccessEntitiesRecordType<CollectionDataType, unknown, EntityAccess>[]
    : KT extends 'resource'
    ? AccessEntitiesRecordType<ResourceDataType, unknown, EntityAccess>[]
    : never
}

export async function reportUser({
  comment,
  profileKey,
  reportOptionTypeId,
  reporterWebUserKey,
}: {
  profileKey: string
  reportOptionTypeId: ReportOptionTypeId
  comment: string
  reporterWebUserKey: string
}) {
  // const currWebUserIds = await getCurrentWebUserIds()
  // const currProfileIds = await getCurrentProfileIds()
  // if (!(currWebUserIds && currProfileIds?.publisher)) {
  //   throw RpcStatus('Unauthorized')
  // }

  const targetWebUser = await getWebUserByProfileKey({ profileKey })
  if (!targetWebUser) {
    throw RpcStatus('Not Found', 'Target web user not found')
  }
  if (targetWebUser.isAdmin) {
    throw RpcStatus('Unauthorized', 'cannot report an admin user')
  }
  const targetProfile = await getProfileRecord(profileKey)
  if (!targetProfile) {
    throw RpcStatus('Not Found', 'Target profile not found')
  }

  const report = shell.events.emit('web-user-reported', {
    comment,
    reporterWebUserKey,
    targetWebUserKey: targetWebUser._key,
    reportOptionTypeId,
  })
  return report
}

export async function editMyProfileInterests({
  asDefaultFilters,
  items,
}: Partial<ProfileInterests>) {
  const profileIds = await getCurrentProfileIds()
  if (!profileIds) return false
  const interests: ProfileInterests = {
    asDefaultFilters,
    items,
  }
  const updateRes = await patchEntity(Profile.entityClass, profileIds._key, {
    settings: {
      interests,
    },
  })
  if (!updateRes) return updateRes

  updateRes.changed &&
    updateRes.patched.settings.interests &&
    shell.events.emit('edit-profile-interests', {
      profileKey: profileIds._key,
      oldProfileInterests: updateRes.old.settings.interests ?? null,
      profileInterests: updateRes.patched.settings.interests,
    })

  return updateRes
}
