import type { RpcFile } from '@moodlenet/core'
import { webImageResizer } from '@moodlenet/react-app/server'
import type {
  AccessEntitiesCustomProject,
  AqlVal,
  EntityAccess,
  GetEntityOpts,
  Patch,
  QueryMyEntitiesOpts,
} from '@moodlenet/system-entities/server'
import {
  create,
  currentEntityVar,
  delEntity,
  getEntity,
  patchEntity,
  queryEntities,
  queryMyEntities,
  toaql,
} from '@moodlenet/system-entities/server'
import { publicFiles } from './init/fs.mjs'
import { Collection } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { CollectionDataType, CollectionEntityDoc } from './types.mjs'

export async function createCollection(collectionData: CollectionDataType) {
  const newCollection = await shell.call(create)(Collection.entityClass, collectionData)

  return newCollection
}

export async function getMyCollections<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(opts?: QueryMyEntitiesOpts<Project, ProjectAccess>) {
  const collectionsCursor = await shell.call(queryMyEntities)(Collection.entityClass, {
    projectAccess: opts?.projectAccess,
    project: opts?.project,
  })
  return collectionsCursor
}

export async function getCollection<
  Project extends AccessEntitiesCustomProject<any>,
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

export async function updateCollectionContent(
  collectionKey: string,
  action: 'add' | 'remove',
  resourceKey: string,
) {
  const aqlResourceListElem: AqlVal<CollectionDataType['resourceList'][number]> = toaql({
    _key: resourceKey,
  })

  const aqlAction =
    action === 'remove'
      ? `REMOVE_VALUE( ${currentEntityVar}.resourceList, ${aqlResourceListElem} , 1 )`
      : `        PUSH( ${currentEntityVar}.resourceList, ${aqlResourceListElem} , true )`
  const updateResult = await shell.call(patchEntity)(
    Collection.entityClass,
    collectionKey,
    `{ 
      resourceList: ${aqlAction}
    }`,
  )

  return updateResult
}

export async function delCollection(_key: string) {
  const patchResult = await shell.call(delEntity)(Collection.entityClass, _key)
  return patchResult
}

export function getImageLogicalFilename(collectionKey: string) {
  return `image/${collectionKey}`
}

export async function setCollectionImage(
  _key: string,
  image: RpcFile | null | undefined,
  opts?: {
    noResize?: boolean
  },
) {
  const imageLogicalFilename = getImageLogicalFilename(_key)
  if (!image) {
    await publicFiles.del(imageLogicalFilename)
    await patchCollection(_key, {
      image: null,
    })
    return null
  }
  const resizedRpcFile = opts?.noResize ? image : await webImageResizer(image, 'image')

  const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

  return patchCollection(_key, {
    image: { kind: 'file', directAccessId },
  })
}

export async function searchCollections(_: /* {limit,sortType,text,after,} */ {
  sortType?: SortType
  text?: string
  after?: string
  limit?: number
}) {
  _
  const cursor = await shell.call(queryEntities)(Collection.entityClass, {
    limit: 6,
    preAccessBody: 'SORT RAND()',
  })

  return cursor.all()
}
export type SortType = 'Relevant' | 'Popular' | 'Recent'
