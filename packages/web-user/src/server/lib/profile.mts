import type { CollectionDataType } from '@moodlenet/collection/server'
import { Collection, deltaCollectionPopularityItem } from '@moodlenet/collection/server'
import { RpcStatus, type RpcFile } from '@moodlenet/core'
import { deltaIscedFieldPopularityItem } from '@moodlenet/ed-meta/server'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import { deltaResourcePopularityItem, Resource } from '@moodlenet/ed-resource/server'
import { getOrgData } from '@moodlenet/organization/server'
import { webSlug } from '@moodlenet/react-app/common'
import {
  defaultImageUploadMaxSize,
  getWebappUrl,
  webImageResizer,
} from '@moodlenet/react-app/server'
import type { EntityClass, SomeEntityDataType } from '@moodlenet/system-entities/common'
import type { EntityAccess, EntityFullDocument } from '@moodlenet/system-entities/server'
import {
  currentEntityVar,
  entityMeta,
  getEntity,
  isCreatorOfCurrentEntity,
  patchEntity,
  queryEntities,
  searchEntities,
  setPkgCurrentUser,
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
import type { KnownFeaturedEntityItem, ProfileDataType } from '../types.mjs'
import { getEntityIdByKnownEntity, isAllowedKnownEntityFeature } from './known-features.mjs'
import {
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

export async function editProfile(
  key: string,
  editData: Partial<ProfileDataType>,
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
  editData = editData.displayName
    ? { ...editData, webslug: webSlug(editData.displayName) }
    : editData

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
  const updateRes = await patchEntity(Profile.entityClass, key, updateWithData, opts)

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

  return updateRes
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
  if (updateResult.patched.publisher) {
    if (feature === 'like') {
      const delta = adding ? 1 : -1
      if (profileCreatorIdentifiers) {
        await shell.initiateCall(async () => {
          await setPkgCurrentUser()
          /* const patchResult = */
          await patchEntity(
            Profile.entityClass,
            profileCreatorIdentifiers.entityIdentifier._key,
            `{ kudos: ${currentEntityVar}.kudos + ( ${delta} ) }`,
          )
          // shell.log('debug', { profileCreatorIdentifiers, patchResult })
        })
      }
      if (entityType === 'resource') {
        await deltaResourcePopularityItem({ _key, itemName: 'likes', delta })
      }
    } else if (feature === 'follow') {
      const delta = adding ? 1 : -1
      if (entityType === 'collection') {
        await deltaCollectionPopularityItem({ _key, itemName: 'followers', delta })
      } else if (entityType === 'profile') {
        await deltaProfilePopularityItem({ _key, itemName: 'followers', delta })
      } else if (entityType === 'subject') {
        await deltaIscedFieldPopularityItem({ _key, itemName: 'followers', delta })
      }
    }
  }
  return updateResult
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
  const needle: KnownFeaturedEntityItem = {
    _id,
    feature,
  }
  const bindVars = { '@collection': Profile.collection.name, needle }
  const query = `
  FOR profile IN @@collection
  FILTER profile.publisher && POSITION(profile.knownFeaturedEntities,@needle)
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
  const needle: KnownFeaturedEntityItem = {
    _id,
    feature,
  }
  const skip = Number(after)
  const cursor = await queryEntities(Profile.entityClass, {
    skip,
    limit,
    postAccessBody: `FILTER ${currentEntityVar}.publisher && POSITION(${currentEntityVar}.knownFeaturedEntities,@needle)`,
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
  if (!rpcFile) {
    await publicFiles.del(avatarLogicalFilename)
    await editProfile(_key, {
      avatarImage: null,
    })
    return null
  }

  const resizedRpcFile = opts?.noResize ? rpcFile : await webImageResizer(rpcFile, 'icon')

  const { directAccessId } = await publicFiles.store(avatarLogicalFilename, resizedRpcFile)

  const patched = await editProfile(_key, {
    avatarImage: { kind: 'file', directAccessId },
  })

  return patched
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
  if (!rpcFile) {
    await publicFiles.del(imageLogicalFilename)
    await editProfile(_key, {
      backgroundImage: null,
    })
    return null
  }

  const resizedRpcFile = opts?.noResize ? rpcFile : await webImageResizer(rpcFile, 'image')

  const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

  const patched = await editProfile(_key, {
    backgroundImage: { kind: 'file', directAccessId },
  })

  return patched
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

export async function deltaProfilePopularityItem({
  _key,
  itemName,
  delta,
}: {
  _key: string
  itemName: string
  delta: number
}) {
  const updatePopularityResult = await sysEntitiesDB.query<ProfileDataType>(
    {
      query: `FOR res in @@profileCollection 
      FILTER res._key == @_key
      LIMIT 1
      UPDATE res WITH {
        popularity:{
          overall: res.popularity.overall + ( ${delta} ),
          items:{
            "${itemName}": (res.popularity.items["${itemName}"] || 0) + ( ${delta} )
          }
        }
      } IN @@profileCollection 
      RETURN NEW`,
      bindVars: { '@profileCollection': Profile.collection.name, _key },
    },
    {
      retryOnConflict: 5,
    },
  )
  const updated = await updatePopularityResult.next()
  return updated?.popularity?.overall
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
      ? `${currentEntityVar}.kudos + ( ${currentEntityVar}.popularity.followers || 0 ) DESC
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

  shell.events.emit('send-message-to-web-user', {
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

export async function getProfileOwnKnownEntities({
  profileKey,
  knownEntity,
}: {
  profileKey: string
  knownEntity: Exclude<KnownEntityType, 'profile' | 'subject'>
}) {
  const { entityIdentifier: profileIdentifier } = WebUserEntitiesTools.getIdentifiersByKey({
    _key: profileKey,
    type: 'Profile',
  })
  const entityClass: EntityClass<ResourceDataType | CollectionDataType> | null =
    knownEntity === 'resource'
      ? Resource.entityClass
      : knownEntity === 'collection'
      ? Collection.entityClass
      : null
  assert(entityClass)
  const list = await (
    await shell.call(queryEntities)(entityClass, {
      preAccessBody: `FILTER ${isCreatorOfCurrentEntity(toaql(profileIdentifier))}`,
    })
  ).all()
  return list
}
