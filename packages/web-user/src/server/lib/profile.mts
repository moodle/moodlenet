import { Collection } from '@moodlenet/collection/server'
import { Resource } from '@moodlenet/ed-resource/server'
import type { RpcFile } from '@moodlenet/core'
import { webImageResizer } from '@moodlenet/react-app/server'
import type { SomeEntityDataType } from '@moodlenet/system-entities/common'
import type { EntityAccess, EntityFullDocument } from '@moodlenet/system-entities/server'
import {
  currentEntityVar,
  getEntity,
  patchEntity,
  queryEntities,
  setPkgCurrentUser,
  sysEntitiesDB,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { KnownEntityFeature, KnownEntityType } from '../../common/types.mjs'
import { WebUserEntitiesTools } from '../entities.mjs'
import { publicFiles } from '../init/fs.mjs'
import { Profile } from '../init/sys-entities.mjs'
import { shell } from '../shell.mjs'
import type { KnownFeaturedEntityItem, ProfileDataType, ProfileEntity } from '../types.mjs'
import { getEntityIdByKnownEntity, isAllowedKnownEntityFeature } from './known-features.mjs'
import { getWebUserByProfileKey, patchWebUser, verifyCurrentTokenCtx } from './web-user.mjs'

export async function editProfile(
  key: string,
  updateWithData: Partial<ProfileDataType>,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const webUser = await getWebUserByProfileKey({ profileKey: key })
  assert(webUser, `couldn't find associated WebUser for profileKey ${key}`)

  const mUpdated = await patchEntity(Profile.entityClass, key, updateWithData, opts)

  if (!mUpdated) {
    return
  }
  const { entity, patched /* ,meta */ } = mUpdated
  const displayNameChanged = patched.displayName && entity.displayName !== patched.displayName
  if (displayNameChanged) {
    await patchWebUser({ _key: webUser._key }, { displayName: patched.displayName })
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
  const current = await getCurrentProfile()
  assert(current)
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

  const iAmCreator = profileCreatorIdentifiers?._id === current._id
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
    current._key,
    `{ 
    knownFeaturedEntities: ${aqlAction}
  }`,
    {
      bindVars: {
        knownFeaturedEntityItem,
      },
    },
  )
  if (profileCreatorIdentifiers) {
    const delta = adding ? '+ 1' : '- 1'
    await shell.initiateCall(async () => {
      await setPkgCurrentUser()
      /* const patchResult = */
      await patchEntity(
        Profile.entityClass,
        profileCreatorIdentifiers.entityIdentifier._key,
        `{ kudos: ${currentEntityVar}.kudos ${delta} }`,
      )
      // console.log({ profileCreatorIdentifiers, patchResult })
    })
  }

  return updateResult
}

export async function getCurrentProfile(): Promise<ProfileEntity | undefined> {
  const verifiedCtx = await verifyCurrentTokenCtx()
  if (!verifiedCtx) {
    return
  }
  const { currentWebUser } = verifiedCtx
  if (currentWebUser.isRoot) {
    return
  }

  const myProfileRecord = await getProfileRecord(currentWebUser.profileKey)
  return myProfileRecord?.entity
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

export async function setProfileAvatar({
  _key,
  rpcFile,
}: {
  _key: string
  rpcFile: RpcFile | null | undefined
}) {
  const avatarLogicalFilename = getProfileAvatarLogicalFilename(_key)
  if (!rpcFile) {
    await publicFiles.del(avatarLogicalFilename)
    await editProfile(_key, {
      avatarImage: null,
    })
    return null
  }

  const resizedRpcFile = await webImageResizer(rpcFile, 'image')

  const { directAccessId } = await publicFiles.store(avatarLogicalFilename, resizedRpcFile)

  const patched = await editProfile(_key, {
    avatarImage: { kind: 'file', directAccessId },
  })

  return patched
}

export async function setProfileBackgroundImage({
  _key,
  rpcFile,
}: {
  _key: string
  rpcFile: RpcFile | null | undefined
}) {
  const imageLogicalFilename = getProfileImageLogicalFilename(_key)
  if (!rpcFile) {
    await publicFiles.del(imageLogicalFilename)
    await editProfile(_key, {
      backgroundImage: null,
    })
    return null
  }

  const resizedRpcFile = await webImageResizer(rpcFile, 'image')

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
