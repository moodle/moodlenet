import type { RpcFile } from '@moodlenet/core'
import { getResource } from '@moodlenet/ed-resource/server'
import { defaultImageUploadMaxSize, webImageResizer } from '@moodlenet/react-app/server'
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
  entityMeta,
  getCurrentEntityUserIdentifier,
  getEntity,
  patchEntity,
  queryMyEntities,
  searchEntities,
  sysEntitiesDB,
  toaql,
} from '@moodlenet/system-entities/server'
import type { CollectionFormProps, SortTypeRpc } from '../common/types.mjs'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles } from './init/fs.mjs'
import { Collection } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { CollectionDataType, CollectionMeta } from './types.mjs'

export async function getValidations() {
  const config: ValidationsConfig = {
    imageMaxUploadSize: defaultImageUploadMaxSize,
  }
  const {
    draftCollectionValidationSchema,
    imageValidationSchema,
    publishedCollectionValidationSchema,
  } = getValidationSchemas(config)
  return {
    draftCollectionValidationSchema,
    imageValidationSchema,
    publishedCollectionValidationSchema,
    config,
  }
}

export async function setPublished(key: string, published: boolean) {
  let matchRev: string | undefined = undefined
  if (published) {
    const collection = await shell.call(getEntity)(Collection.entityClass, key)
    if (!collection) {
      return null
    }
    if (published === collection.entity.published) {
      return true
    }
    const { publishedCollectionValidationSchema } = await getValidations()
    const collectionFormProps: CollectionFormProps = {
      description: collection.entity.description,
      title: collection.entity.title,
    }
    const isValid = await publishedCollectionValidationSchema.isValid(collectionFormProps)
    if (!isValid) {
      return false
    }
    matchRev = collection.entity._rev
  }
  const patchResult = await shell.call(patchEntity)(
    Collection.entityClass,
    key,
    { published },
    {
      matchRev,
      preAccessBody: published ? `FILTER ${canPublish()}` : undefined,
    },
  )
  if (!patchResult) {
    return
  }
  const userId = await getCurrentEntityUserIdentifier()
  if (userId && patchResult.changed) {
    shell.events.emit(published ? 'published' : 'unpublished', {
      collection: patchResult.patched,
      userId,
      // resourceListInfo: await getExistingResourcesInCollectionInfo(
      //   patchResult.patched._meta.creatorEntityId,
      //   patchResult.patched.resourceList,
      // ),
    })
  }
  return patchResult
}

export async function patchCollection(
  key: string,
  patch: Patch<Pick<CollectionDataType, 'description' | 'title'>>,
) {
  const collection = await shell.call(getEntity)(Collection.entityClass, key)
  if (!collection) {
    return null
  }
  const { draftCollectionValidationSchema, publishedCollectionValidationSchema } =
    await getValidations()
  const collectionFormProps: CollectionFormProps = {
    description: patch.description ?? collection.entity.description,
    title: patch.title ?? collection.entity.title,
  }
  const isValid = await (collection.entity.published
    ? publishedCollectionValidationSchema
    : draftCollectionValidationSchema
  ).isValid(collectionFormProps)

  if (!isValid) {
    return false
  }

  const patchResult = await shell.call(patchEntity)(
    Collection.entityClass,
    key,
    collectionFormProps,
    {
      postAccessBody: `FILTER !MATCHES( ${currentEntityVar}, ${toaql(collectionFormProps)} )`,
      matchRev: collection.entity._rev,
    },
  )
  if (!patchResult) {
    return
  }

  const userId = await getCurrentEntityUserIdentifier()
  if (userId && patchResult.changed) {
    shell.events.emit('updated-meta', {
      meta: getCollectionMeta(patchResult.patched),
      oldMeta: getCollectionMeta(patchResult.old),
      collectionKey: key,
      userId,
    })
  }

  return patchResult
}
export function getCollectionMeta(collectionData: CollectionDataType): CollectionMeta {
  const { description, image, title } = collectionData
  return { description, image, title }
}
export async function createCollection(collectionData: Partial<CollectionDataType>) {
  const newCollection = await shell.call(create)(Collection.entityClass, {
    description: '',
    title: '',
    image: null,
    published: false,
    resourceList: [],
    ...collectionData,
  })
  if (!newCollection) {
    return
  }
  const userId = await getCurrentEntityUserIdentifier()
  if (userId) {
    shell.events.emit('created', {
      collection: newCollection,
      userId,
    })
  }
  return newCollection
}

export async function deltaCollectionPopularityItem({
  _key,
  itemName,
  delta,
}: {
  _key: string
  itemName: string
  delta: number
}) {
  const updatePopularityResult = await sysEntitiesDB.query<CollectionDataType>(
    {
      query: `FOR res in @@collections 
      FILTER res._key == @_key
      LIMIT 1
      UPDATE res WITH {
        popularity:{
          overall: res.popularity.overall + ( ${delta} ),
          items:{
            "${itemName}": (res.popularity.items["${itemName}"] || 0) + ( ${delta} )
          }
        }
      } IN @@collections 
      RETURN NEW`,
      bindVars: { '@collections': Collection.collection.name, _key },
    },
    {
      retryOnConflict: 5,
    },
  )
  const updated = await updatePopularityResult.next()
  return updated?.popularity?.overall
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

export async function updateCollectionContent(
  collectionKey: string,
  action: 'add' | 'remove',
  resourceKey: string,
) {
  const resource = await getResource(resourceKey)
  if (!resource) {
    return
  }
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
  if (!updateResult) {
    return
  }

  const userId = await getCurrentEntityUserIdentifier()

  if (userId && updateResult.changed) {
    shell.events.emit('resource-list-curation', {
      collection: updateResult.patched,
      action,
      resource: { ...resource.entity, _meta: resource.meta },
      resourceList: updateResult.patched.resourceList,
      userId,
    })
  }
  return updateResult
}

// export async function getExistingResourcesInCollectionInfo(
//   collectionCreatorId: string | undefined,
//   resourceKeyList: { _key: string }[],
// ): Promise<ResourceInCollectionInfo[]> {
//   const exisingResourcesInCollectionInfo = (
//     await Promise.all(
//       resourceKeyList.map(({ _key }) => Resource.collection.document({ _key }, { graceful: true })),
//     )
//   )
//     .filter(Boolean)
//     .map<ResourceInCollectionInfo>(res => {
//       const creatorId = res._meta.creatorEntityId
//       assert(creatorId)
//       return {
//         key: res._key,
//         creatorId,
//         published: res.published,
//         sameAsCollectionCreator: creatorId === collectionCreatorId,
//       }
//     })

//   return exisingResourcesInCollectionInfo
// }
export async function delCollection(_key: string) {
  const userId = await getCurrentEntityUserIdentifier()
  if (!userId) {
    return
  }
  const found = await shell.call(getEntity)(Collection.entityClass, _key)
  if (!found) {
    return
  }
  if (!found.entity.published) {
    shell.events.emit('unpublished', {
      collection: { ...found.entity, _meta: found.meta },
      userId,
      // resourceListInfo: await getExistingResourcesInCollectionInfo(
      //   found.meta.creatorEntityId,
      //   found.entity.resourceList,
      // ),
    })
  }
  await shell.call(delEntity)(Collection.entityClass, _key)
  shell.events.emit('deleted', {
    collection: { ...found.entity, _meta: found.meta },
    userId,
  })
  return found
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
  const imageProp = !image
    ? null
    : await (async () => {
        const resizedRpcFile = opts?.noResize ? image : await webImageResizer(image, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        const imageProp = { kind: 'file', directAccessId } as const
        return imageProp
      })()

  const patchResult = await shell.call(patchEntity)(Collection.entityClass, _key, {
    image: imageProp,
  })
  if (!imageProp || !patchResult) {
    await publicFiles.del(imageLogicalFilename)
    if (!patchResult) {
      return patchResult
    }
  }

  const userId = await getCurrentEntityUserIdentifier()
  if (userId && patchResult.changed) {
    shell.events.emit('updated-meta', {
      collectionKey: _key,
      meta: getCollectionMeta(patchResult.patched),
      oldMeta: getCollectionMeta(patchResult.old),
      userId,
    })
  }
  return patchResult
}

export async function searchCollections({
  limit = 20,
  sortType = 'Recent',
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
      ? `${currentEntityVar}.popularity.overall DESC, rank DESC`
      : sortType === 'Relevant'
      ? 'rank DESC'
      : sortType === 'Recent'
      ? `${entityMeta(currentEntityVar, 'created')} DESC`
      : 'rank DESC'
  const skip = Number(after)
  const cursor = await shell.call(searchEntities)(
    Collection.entityClass,
    text,
    [{ name: 'title', factor: 5 }, { name: 'description' }],
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
