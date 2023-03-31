import { RpcFile } from '@moodlenet/core'
import { webUserCreatorEntity } from '@moodlenet/react-app/server'
import {
  create,
  delEntity,
  EntityAccess,
  getEntity,
  Patch,
  patchEntity,
} from '@moodlenet/system-entities/server'
import { Collection, publicFiles } from './init.mjs'
import { shell } from './shell.mjs'
import { CollectionDataType, CollectionEntityDoc } from './types.mjs'

export async function createCollection(collectionData: CollectionDataType) {
  const newCollection = await shell.call(create)(Collection.entityClass, collectionData)

  return newCollection
}

export async function getCollection(
  _key: string,
  opts?: {
    projectAccess?: EntityAccess[]
  },
) {
  const foundCollection = await shell.call(getEntity)(Collection.entityClass, _key, {
    projectAccess: opts?.projectAccess,
    project: {
      creator: webUserCreatorEntity(),
    },
  })
  return foundCollection
}

export async function patchCollection(_key: string, patch: Patch<CollectionEntityDoc>) {
  const patchResult = await shell.call(patchEntity)(Collection.entityClass, _key, patch)
  return patchResult
}

export async function delCollection(_key: string) {
  const patchResult = await shell.call(delEntity)(Collection.entityClass, _key)
  return patchResult
}

export async function storeImageFile(collectionKey: string, imageRpcFile: RpcFile) {
  const imageLogicalFilename = getImageLogicalFilename(collectionKey)

  const fsItem = await publicFiles.store(imageLogicalFilename, imageRpcFile)

  return fsItem
}

function getImageLogicalFilename(collectionKey: string) {
  return `image/${collectionKey}`
}
