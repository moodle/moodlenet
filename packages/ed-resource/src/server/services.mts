import type { RpcFile } from '@moodlenet/core'
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
  delEntity,
  entityMeta,
  getEntity,
  patchEntity,
  searchEntities,
} from '@moodlenet/system-entities/server'
import type { SortTypeRpc } from '../common/types.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { Resource } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { ResourceDataType, ResourceEntityDoc } from './types.mjs'

export async function createResource(resourceData: ResourceDataType) {
  const newResource = await shell.call(create)(Resource.entityClass, resourceData)

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

export async function searchResources({
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
      ? '0'
      : sortType === 'Relevant'
      ? '0'
      : sortType === 'Recent'
      ? `
  ${entityMeta('created')} DESC`
      : '0'
  const skip = Number(after)
  const cursor = await shell.call(searchEntities)(
    Resource.entityClass,
    text,
    [{ name: 'title', factor: 5 }, { name: 'description' }],
    {
      limit,
      skip,
      //forOptions: `OPTIONS { indexHint:"${TEXT_SEARCH_INDEX_NAME}", forceIndexHint: true }`,
      postAccessBody: `
    SORT ${sort}`,
    },
  )

  const list = await cursor.all()
  return {
    list,
    endCursor: list.length < limit ? undefined : String(skip + list.length),
  }
}
