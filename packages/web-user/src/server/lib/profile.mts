import { Collection, deltaCollectionPopularityItem } from '@moodlenet/collection/server'
import type { RpcFile } from '@moodlenet/core'
import { deltaIscedFieldPopularityItem } from '@moodlenet/ed-meta/server'
import { deltaResourcePopularityItem, Resource } from '@moodlenet/ed-resource/server'
import { webSlug } from '@moodlenet/react-app/common'
import { webImageResizer } from '@moodlenet/react-app/server'
import type { SomeEntityDataType } from '@moodlenet/system-entities/common'
import type { EntityAccess, EntityFullDocument } from '@moodlenet/system-entities/server'
import {
  currentEntityVar,
  entityMeta,
  getEntity,
  patchEntity,
  queryEntities,
  searchEntities,
  setPkgCurrentUser,
  sysEntitiesDB,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { KnownEntityFeature, KnownEntityType, SortTypeRpc } from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { publicFiles } from '../init/fs.mjs'
import { Profile } from '../init/sys-entities.mjs'
import { shell } from '../shell.mjs'
import type { KnownFeaturedEntityItem, ProfileDataType } from '../types.mjs'
import { getEntityIdByKnownEntity, isAllowedKnownEntityFeature } from './known-features.mjs'
import {
  getCurrentProfileIds,
  getWebUserByProfileKey,
  patchWebUserDisplayName,
  verifyCurrentTokenCtx,
} from './web-user.mjs'

export async function editProfile(
  key: string,
  updateWithData: Partial<ProfileDataType>,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const webUser = await getWebUserByProfileKey({ profileKey: key })
  assert(webUser, `couldn't find associated WebUser for profileKey ${key}`)
  updateWithData = updateWithData.displayName
    ? { ...updateWithData, webslug: webSlug(updateWithData.displayName) }
    : updateWithData
  const mUpdated = await patchEntity(Profile.entityClass, key, updateWithData, opts)

  if (!mUpdated) {
    return
  }
  const { entity, patched /* ,meta */ } = mUpdated
  const displayNameChanged = patched.displayName && entity.displayName !== patched.displayName
  if (displayNameChanged) {
    await patchWebUserDisplayName({ _key: webUser._key, displayName: patched.displayName })
  }

  return mUpdated
}

export async function entityFeatureAction({
  _key,
  action,
  entityType,
  feature,
}: {
  action: 'add' | 'remove'
  feature: KnownEntityFeature
  entityType: KnownEntityType
  _key: string
}) {
  const adding = action === 'add'
  adding && assert(isAllowedKnownEntityFeature({ entityType, feature }))
  const currentProfileIds = await getCurrentProfileIds()
  assert(currentProfileIds)
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

  const iAmCreator = profileCreatorIdentifiers?._id === currentProfileIds._id
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
    currentProfileIds._key,
    `{ 
    knownFeaturedEntities: ${aqlAction}
  }`,
    {
      bindVars: {
        knownFeaturedEntityItem,
      },
    },
  )
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
  FILTER POSITION(profile.knownFeaturedEntities,@needle)
  COLLECT WITH COUNT INTO count
  RETURN { count } 
  `
  const cursor = await sysEntitiesDB.query<{ count: number }>({
    query,
    bindVars,
  })

  return cursor.next()
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

export async function getLandingPageList(entity: 'collections' | 'profiles' | 'resources') {
  const entityClass = {
    collections: Collection,
    profiles: Profile,
    resources: Resource,
  }[entity].entityClass

  const cursor = await shell.call(queryEntities)(entityClass, {
    limit: 6,
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

  // const fromWebUserKey = tokenCtx.payload.webUser._key
  //TODO //@ALE prepare formatted messages
  const toWebUser = await getWebUserByProfileKey({ profileKey })
  if (!toWebUser) return

  const webUserKey = toWebUser._key
  shell.events.emit('send-message-to-web-user', {
    message: {
      text: message,
      html: message,
    },
    webUserKey,
  })
}
