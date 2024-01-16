import type { CollectionDataType } from '@moodlenet/collection/server'
import { Collection } from '@moodlenet/collection/server'
import { RpcStatus, type RpcFile } from '@moodlenet/core'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { Resource } from '@moodlenet/ed-resource/server'
import { getOrgData } from '@moodlenet/organization/server'
import { webSlug } from '@moodlenet/react-app/common'
import {
  defaultImageUploadMaxSize,
  getWebappUrl,
  webImageResizer,
} from '@moodlenet/react-app/server'
import type { EntityClass, SomeEntityDataType } from '@moodlenet/system-entities/common'
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
import dot from 'dot'
import type { EditProfileDataRpc } from '../../common/expose-def.mjs'
import type { KnownEntityFeature, KnownEntityType, SortTypeRpc } from '../../common/types.mjs'
import type { ValidationsConfig } from '../../common/validationSchema.mjs'
import { getValidationSchemas } from '../../common/validationSchema.mjs'
import { getProfileHomePageRoutePath } from '../../common/webapp-routes.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { publicFiles } from '../init/fs.mjs'
import { kvStore } from '../init/kvStore.mjs'
import { Profile } from '../init/sys-entities.mjs'
import { shell } from '../shell.mjs'
import type {
  ImageUploaded,
  KnownFeaturedEntityItem,
  ProfileDataType,
  ProfileInterests,
  ProfileMeta,
} from '../types.mjs'
import { getEntityIdByKnownEntity, isAllowedKnownEntityFeature } from './known-features.mjs'
import { deltaPopularity } from './popularity.mjs'
import {
  getCurrentProfileIds,
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
    await sysEntitiesDB.query<EntityFullDocument<SomeEntityDataType>>({
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

  const knownFeaturedEntityItem: KnownFeaturedEntityItem = {
    _id: targetEntityId,
    feature,
    at: shell.now().toISOString(),
  }

  const aqlAction =
    action === 'remove'
      ? `REMOVE_VALUE( ${currentEntityVar}.knownFeaturedEntities, @knownFeaturedEntityItem , 1 )`
      : `        PUSH( ${currentEntityVar}.knownFeaturedEntities, @knownFeaturedEntityItem , true )`

  const updateResult = await shell.call(patchEntity)(
    Profile.entityClass,
    profileKey,
    `{ 
    knownFeaturedEntities: ${aqlAction}
  }`,
    {
      bindVars: {
        knownFeaturedEntityItem,
      },
    },
  )
  assert(updateResult)

  shell.events.emit('feature-entity', {
    action,
    profileKey,
    item: knownFeaturedEntityItem,
    currentItemsOfSameType: updateResult.patched.knownFeaturedEntities.filter(
      item => item.feature === feature,
    ),
  })

  if (updateResult.patched.publisher) {
    await deltaPopularity(adding, {
      feature,
      profileCreatorIdentifiers,
      entityType,
      entityKey: _key,
    })
  }
  return updateResult
}

export async function setProfilePublisherFlag({
  profileKey,
  isPublisher: setIsPublisher,
}: {
  profileKey: string
  isPublisher: boolean
}) {
  const moderator = await getCurrentSystemUser()
  assert(moderator.type === 'pkg' || moderator.type === 'entity')

  const profile = await getProfileRecord(profileKey)
  if (!profile) return { type: 'not-found', ok: false }
  if (profile.entity.publisher === setIsPublisher) return { type: 'no-change', ok: true }

  await patchEntity(Profile.entityClass, profileKey, { publisher: setIsPublisher })
  shell.events.emit('user-publishing-permission-change', {
    type: setIsPublisher ? 'given' : 'revoked',
    profileKey,
    moderator,
  })
  return { type: 'done', ok: true }
}

export async function getProfileRecord(
  key: string,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const record = await getEntity(Profile.entityClass, key, {
    projectAccess: opts?.projectAccess,
  })
  return record
}

export async function getEntityFeatureCount({
  _key,
  entityType,
  feature,
}: {
  feature: Exclude<KnownEntityFeature, 'bookmark'>
  entityType: KnownEntityType
  _key: string
}) {
  const _id = getEntityIdByKnownEntity({ _key, entityType })
  const needle: Pick<KnownFeaturedEntityItem, '_id' | 'feature'> = {
    _id,
    feature,
  }
  const bindVars = { '@collection': Profile.collection.name, needle }
  const query = `
  FOR profile IN @@collection
  FILTER profile.publisher && @needle IN (FOR item in profile.knownFeaturedEntities RETURN { _id:item._id, feature :item.feature })
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
  const _id = getEntityIdByKnownEntity({ _key, entityType })
  const needle: Pick<KnownFeaturedEntityItem, '_id' | 'feature'> = {
    _id,
    feature,
  }
  const skip = Number(after)
  const cursor = await queryEntities(Profile.entityClass, {
    skip,
    limit,
    postAccessBody: `FILTER ${currentEntityVar}.publisher && @needle IN (FOR item in ${currentEntityVar}.knownFeaturedEntities RETURN { _id:item._id, feature :item.feature })  `,
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
    collections: Collection,
    profiles: Profile,
    resources: Resource,
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
  sortType?: SortTypeRpc
  text?: string
  after?: string
  limit?: number
}) {
  const sort =
    sortType === 'Popular'
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

export async function sendMessageToProfile({
  message,
  profileKey,
}: {
  message: string
  profileKey: string
}) {
  const tokenCtx = await verifyCurrentTokenCtx()
  if (!tokenCtx || tokenCtx.payload.isRoot || !tokenCtx.payload.webUser) return
  const templates = (await kvStore.get('message-templates', '')).value
  assert(templates)

  //TODO //@ALE prepare formatted messages
  const toWebUser = await getWebUserByProfileKey({ profileKey })
  if (!toWebUser) return
  const fromProfile = (await getProfileRecord(tokenCtx.payload.profile._key))?.entity
  assert(fromProfile)
  const orgData = await getOrgData()

  const msgVars: SendMsgToUserVars = {
    actionButtonUrl: getWebappUrl(
      getProfileHomePageRoutePath({ _key: fromProfile._key, displayName: fromProfile.displayName }),
    ),
    instanceName: orgData.data.instanceName,
    message,
  }
  const html = dot.compile(templates.messageFromUser)(msgVars)

  shell.events.emit('request-send-message-to-web-user', {
    message: {
      text: html,
      html: html,
    },
    subject: `${fromProfile.displayName} sent you a message 📨`,
    title: `${fromProfile.displayName} sent you a message 📨`,
    toWebUser: {
      _key: toWebUser._key,
      displayName: toWebUser.displayName,
    },
  })

  type SendMsgToUserVars = Record<'actionButtonUrl' | 'instanceName' | 'message', string>
}

export async function getProfileOwnKnownEntities<
  KT extends Exclude<KnownEntityType, 'profile' | 'subject'>,
>({ profileKey, knownEntity }: { profileKey: string; knownEntity: KT }) {
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
      ? Resource.entityClass
      : knownEntity === 'collection'
      ? Collection.entityClass
      : null
  ) as _ClassType

  assert(entityClass, `getProfileOwnKnownEntities: unknown knownEntity ${knownEntity}`)
  const list = await (
    await shell.call(queryEntities)(entityClass, {
      preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
    })
  ).all()
  return list as KT extends 'collection'
    ? AccessEntitiesRecordType<CollectionDataType, unknown, EntityAccess>[]
    : KT extends 'resource'
    ? AccessEntitiesRecordType<ResourceDataType, unknown, EntityAccess>[]
    : never
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

  updateRes.patched.settings.interests &&
    shell.events.emit('edit-profile-interests', {
      profileKey: profileIds._key,
      profileInterests: updateRes.patched.settings.interests,
    })

  return updateRes
}
