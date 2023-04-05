import { RpcFile } from '@moodlenet/core'
import {
  create,
  delEntity,
  EntityAccess,
  getEntity,
  GetEntityOpts,
  Patch,
  patchEntity,
  QueryEntitiesCustomProject,
} from '@moodlenet/system-entities/server'
import { Collection, publicFiles, publicFilesHttp } from './init.mjs'
import { shell } from './shell.mjs'
import { CollectionDataType, CollectionEntityDoc } from './types.mjs'

export async function createCollection(collectionData: CollectionDataType) {
  const newCollection = await shell.call(create)(Collection.entityClass, collectionData)

  return newCollection
}

export async function getCollection<
  Project extends QueryEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(_key: string, opts?: GetEntityOpts<Project, ProjectAccess>) {
  const foundCollection = await shell.call(getEntity)(Collection.entityClass, _key, {
    projectAccess: opts?.projectAccess,
    project: opts?.project,
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

export function getImageLogicalFilename(collectionKey: string) {
  return `image/${collectionKey}`
}

export function getImageUrl(collectionKey: string) {
  return publicFilesHttp.getFileUrl(getImageLogicalFilename(collectionKey))
}
