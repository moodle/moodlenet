import type { RpcFile } from '@moodlenet/core'
import { instanceDomain } from '@moodlenet/core'
import { getMyRpcBaseUrl } from '@moodlenet/http-server/server'
import { webImageResizer } from '@moodlenet/react-app/server'
import type {
  AccessEntitiesCustomProject,
  EntityAccess,
  GetEntityOpts,
  Patch,
} from '@moodlenet/system-entities/server'
import {
  create,
  currentEntityVar,
  delEntity,
  entityMeta,
  getEntity,
  patchEntity,
  searchEntities,
  sysEntitiesDB,
  toaql,
} from '@moodlenet/system-entities/server'
import type { SortTypeRpc } from '../common/types.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { Resource } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { ResourceDataType, ResourceEntityDoc } from './types.mjs'

export async function setPublished(key: string, published: boolean) {
  const patchResult = await shell.call(patchEntity)(
    Resource.entityClass,
    key,
    { published },
    published ? { preAccessBody: `FILTER ${canPublish()}` } : {},
  )
  if (!patchResult) {
    return
  }
  return patchResult
}
export async function createResource(resourceData: Partial<ResourceDataType>) {
  const newResource = await shell.call(create)(Resource.entityClass, {
    description: '',
    title: '',
    content: null,
    image: null,
    published: false,
    license: '',
    subject: '',
    language: '',
    level: '',
    month: '',
    year: '',
    type: '',
    ...resourceData,
  })

  return newResource
}

export async function getResource<
  Project extends AccessEntitiesCustomProject<any>,
  ProjectAccess extends EntityAccess,
>(_key: string, opts?: GetEntityOpts<Project, ProjectAccess>) {
  const foundResource = await shell.call(getEntity)(Resource.entityClass, _key, {
    projectAccess: opts?.projectAccess,
    project: opts?.project,
  })
  return foundResource
}

export async function incrementResourceDownloads({ _key }: { _key: string }) {
  return deltaResourcePopularityItem({ _key, itemName: 'downloads', delta: 1 })
}

export async function deltaResourcePopularityItem({
  _key,
  itemName,
  delta,
}: {
  _key: string
  itemName: string
  delta: number
}) {
  const updatePopularityResult = await sysEntitiesDB.query<ResourceDataType>(
    {
      query: `FOR res in @@resourceCollection 
      FILTER res._key == @_key
      LIMIT 1
      UPDATE res WITH {
        popularity:{
          overall: res.popularity.overall + ( ${delta} ),
          items:{
            "${itemName}": (res.popularity.items["${itemName}"] || 0) + ( ${delta} )
          }
        }
      } IN @@resourceCollection 
      RETURN NEW`,
      bindVars: { '@resourceCollection': Resource.collection.name, _key },
    },
    {
      retryOnConflict: 5,
    },
  )
  const updated = await updatePopularityResult.next()
  return updated?.popularity?.overall
}

export async function patchResource(_key: string, patch: Patch<ResourceEntityDoc>) {
  const patchResult = await shell.call(patchEntity)(Resource.entityClass, _key, patch)
  return patchResult
}

export async function delResource(_key: string) {
  const patchResult = await shell.call(delEntity)(Resource.entityClass, _key)
  return patchResult
}

export function getImageLogicalFilename(resourceKey: string) {
  return `image/${resourceKey}`
}

export async function storeResourceFile(resourceKey: string, imageRpcFile: RpcFile) {
  const resourceLogicalFilename = getResourceLogicalFilename(resourceKey)

  const fsItem = await resourceFiles.store(resourceLogicalFilename, imageRpcFile)

  return fsItem
}

export async function delResourceFile(resourceKey: string) {
  const resourceLogicalFilename = getResourceLogicalFilename(resourceKey)
  const fsItem = await resourceFiles.del(resourceLogicalFilename)
  return fsItem
}
export function getResourceLogicalFilename(resourceKey: string) {
  return `resource-file/${resourceKey}`
}

export const RESOURCE_DOWNLOAD_ENDPOINT = 'dl/ed-resource/:_key/:filename'
export async function getResourceFileUrl({ rpcFile, _key }: { _key: string; rpcFile: RpcFile }) {
  const resourcePath = RESOURCE_DOWNLOAD_ENDPOINT.replace(':_key', _key).replace(
    ':filename',
    rpcFile.name,
  )
  const myRpcBaseUrl = await shell.call(getMyRpcBaseUrl)()
  return `${myRpcBaseUrl}${resourcePath}`
}

export async function setResourceImage(
  _key: string,
  image: RpcFile | null | undefined,
  opts?: {
    noResize?: boolean
  },
) {
  const imageLogicalFilename = getImageLogicalFilename(_key)
  if (!image) {
    await publicFiles.del(imageLogicalFilename)
    await patchResource(_key, {
      image: null,
    })
    return null
  }
  const resizedRpcFile = opts?.noResize ? image : await webImageResizer(image, 'image')

  const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

  return patchResource(_key, {
    image: { kind: 'file', directAccessId },
  })
}
export async function setResourceContent(_key: string, resourceContent: RpcFile | string) {
  const content =
    typeof resourceContent === 'string'
      ? resourceContent
      : await storeResourceFile(_key, resourceContent)

  const isUrlContent = typeof content === 'string'
  if (isUrlContent && content.startsWith(instanceDomain)) {
    return
  }
  const contentProp: ResourceDataType['content'] = isUrlContent
    ? {
        kind: 'link',
        url: content,
      }
    : {
        kind: 'file',
        fsItem: content,
      }

  const patchedDoc = await patchResource(_key, { content: contentProp })
  if (!patchedDoc) {
    await delResourceFile(_key)
    return
  }
  const contentUrl = await (isUrlContent
    ? content
    : getResourceFileUrl({ _key, rpcFile: content.rpcFile }))
  return { patchedDoc, contentUrl }
}

export type SearchFilterType = [prop: 'subject', equals: string][]

export async function searchResources({
  limit = 20,
  sortType = 'Recent',
  text = '',
  after = '0',
  filters = [],
}: {
  sortType?: SortTypeRpc
  text?: string
  after?: string
  limit?: number
  filters?: SearchFilterType
}) {
  const sort =
    sortType === 'Popular'
      ? `${currentEntityVar}.popularity.overall DESC, rank DESC`
      : sortType === 'Relevant'
      ? 'rank DESC'
      : sortType === 'Recent'
      ? `${entityMeta(currentEntityVar, 'created')} DESC`
      : 'rank DESC'
  const filter = filters.map(([p, val]) => `${currentEntityVar}.${p} == ${toaql(val)}`).join(' OR ')
  const skip = Number(after)
  const cursor = await shell.call(searchEntities)(
    Resource.entityClass,
    text,
    [{ name: 'title', factor: 5 }, { name: 'description' }],
    {
      limit,
      skip,
      sort,
      preAccessBody: filter ? `FILTER ${filter}` : undefined,
      //forOptions: `OPTIONS { indexHint:"${TEXT_SEARCH_INDEX_NAME}", forceIndexHint: true }`,
    },
  )

  const list = await cursor.all()
  return {
    list,
    endCursor: list.length < limit ? undefined : String(skip + list.length),
  }
}

export async function getResourcesCountInSubject({ subjectKey }: { subjectKey: string }) {
  const bindVars = { '@collection': Resource.collection.name, subjectKey }
  const query = `
  FOR resource IN @@collection
  FILTER resource.published && resource.subject==@subjectKey
  COLLECT WITH COUNT INTO count
  RETURN { count } 
  `
  const cursor = await sysEntitiesDB.query<{ count: number }>({
    query,
    bindVars,
  })

  return cursor.next()
}
