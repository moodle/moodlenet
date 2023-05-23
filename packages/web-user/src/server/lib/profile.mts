import type { EntityAccess } from '@moodlenet/system-entities/server'
import {
  currentEntityVar,
  getEntity,
  patchEntity,
  sysEntitiesDB,
  toaql,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import type { KnownEntityFeature, KnownEntityType } from '../../common/types.mjs'
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
  action === 'add' && assert(isAllowedKnownEntityFeature({ entityType, feature }))
  const current = await getCurrentProfile()
  assert(current)
  const _id = getEntityIdByKnownEntity({ _key, entityType })
  const knownFeaturedEntityItem = toaql<KnownFeaturedEntityItem>({
    _id,
    feature,
  })

  const aqlAction =
    action === 'remove'
      ? `REMOVE_VALUE( ${currentEntityVar}.knownFeaturedEntities, ${knownFeaturedEntityItem} , 1 )`
      : `        PUSH( ${currentEntityVar}.knownFeaturedEntities, ${knownFeaturedEntityItem} , true )`
  const updateResult = await shell.call(patchEntity)(
    Profile.entityClass,
    current._key,
    `{ 
    knownFeaturedEntities: ${aqlAction}
  }`,
  )

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

export function getProfileImageLogicalFilename(profileKey: string) {
  return `profile-image/${profileKey}`
}

export function getProfileAvatarLogicalFilename(profileKey: string) {
  return `profile-avatar/${profileKey}`
}
