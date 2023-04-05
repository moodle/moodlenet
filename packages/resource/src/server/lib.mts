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
import { publicFiles, publicFilesHttp, Resource } from './init.mjs'
import { shell } from './shell.mjs'
import { ResourceDataType, ResourceEntityDoc } from './types.mjs'

export async function createResource(resourceData: ResourceDataType) {
  const newResource = await shell.call(create)(Resource.entityClass, resourceData)

  return newResource
}

export async function getResource<
  Project extends QueryEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(_key: string, opts?: GetEntityOpts<Project, ProjectAccess>) {
  const foundResource = await shell.call(getEntity)(Resource.entityClass, _key, {
    projectAccess: opts?.projectAccess,
    project: opts?.project,
  })
  return foundResource
}

export async function patchResource(_key: string, patch: Patch<ResourceEntityDoc>) {
  const patchResult = await shell.call(patchEntity)(Resource.entityClass, _key, patch)
  return patchResult
}

export async function delResource(_key: string) {
  const patchResult = await shell.call(delEntity)(Resource.entityClass, _key)
  return patchResult
}

export async function storeImageFile(resourceKey: string, imageRpcFile: RpcFile) {
  const imageLogicalFilename = getImageLogicalFilename(resourceKey)

  const fsItem = await publicFiles.store(imageLogicalFilename, imageRpcFile)

  return fsItem
}

export function getImageLogicalFilename(resourceKey: string) {
  return `image/${resourceKey}`
}

export function getImageUrl(resourceKey: string) {
  return publicFilesHttp.getFileUrl(getImageLogicalFilename(resourceKey))
}

export async function storeContentFile(resourceKey: string, imageRpcFile: RpcFile) {
  const imageLogicalFilename = getImageLogicalFilename(resourceKey)

  const fsItem = await publicFiles.store(imageLogicalFilename, imageRpcFile)

  return fsItem
}

export function getContentLogicalFilename(resourceKey: string) {
  return `image/${resourceKey}`
}

export function getContentUrl(resourceKey: string) {
  return `resourceContent.getFileUrl(getImageLogicalFilename(${resourceKey}))`
}
