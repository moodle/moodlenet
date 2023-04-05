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
import { Collection } from './init.mjs'
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

export function getImageLogicalFilename(collectionKey: string) {
  return `image/${collectionKey}`
}
