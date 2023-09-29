import type { RpcFile } from '@moodlenet/core'
import { instanceDomain } from '@moodlenet/core'
import { getMyRpcBaseUrl } from '@moodlenet/http-server/server'
import { defaultImageUploadMaxSize, webImageResizer } from '@moodlenet/react-app/server'
import type {
  AccessEntitiesCustomProject,
  EntityAccess,
  GetEntityOpts,
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
import type { ResourceFormProps } from '../common/types.mjs'
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { canPublish } from './aql.mjs'
import { env } from './init/env.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { Resource } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { ResourceDataType, ResourceEntityDoc } from './types.mjs'

export async function getValidations() {
  const config: ValidationsConfig = {
    contentMaxUploadSize: env.resourceUploadMaxSize,
    imageMaxUploadSize: defaultImageUploadMaxSize,
  }
  const {
    draftResourceValidationSchema,
    publishedResourceValidationSchema,
    draftContentValidationSchema,
    publishedContentValidationSchema,
    imageValidationSchema,
  } = getValidationSchemas(config)

  return {
    draftContentValidationSchema,
    publishedContentValidationSchema,
    draftResourceValidationSchema,
    publishedResourceValidationSchema,
    imageValidationSchema,
    config,
  }
}

export async function setPublished(key: string, published: boolean) {
  let matchRev: string | undefined = undefined
  if (published) {
    const resource = await shell.call(getEntity)(Resource.entityClass, key)
    if (!resource) {
      return null
    }
    if (!resource.entity.content) {
      return false
    }

    const { publishedResourceValidationSchema } = await getValidations()
    const resourceFormProps: ResourceFormProps = {
      description: resource.entity.description,
      title: resource.entity.title,
      language: resource.entity.language,
      level: resource.entity.level,
      license: resource.entity.license,
      subject: resource.entity.subject,
      type: resource.entity.type,
      month: resource.entity.month,
      year: resource.entity.year,
      learningOutcomes: resource.entity.learningOutcomes,
    }
    const isValid = await publishedResourceValidationSchema.isValid(resourceFormProps)
    if (!isValid) {
      return false
    }
    matchRev = resource.entity._rev
  }
  const patchResult = await shell.call(patchEntity)(
    Resource.entityClass,
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
    learningOutcomes: [],
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

export async function patchResource(_key: string, patch: Partial<ResourceEntityDoc>) {
  const resource = await shell.call(getEntity)(Resource.entityClass, _key)
  if (!resource) {
    return null
  }
  const { draftResourceValidationSchema, publishedResourceValidationSchema } =
    await getValidations()
  const resourceFormProps: ResourceFormProps = {
    description: patch.description ?? resource.entity.description,
    title: patch.title ?? resource.entity.title,
    language: patch.language ?? resource.entity.language,
    level: patch.level ?? resource.entity.level,
    license: patch.license ?? resource.entity.license,
    month: patch.month ?? resource.entity.month,
    subject: patch.subject ?? resource.entity.subject,
    type: patch.type ?? resource.entity.type,
    year: patch.year ?? resource.entity.year,
    learningOutcomes: patch.learningOutcomes ?? resource.entity.learningOutcomes,
  }
  const isValid = await (resource.entity.published
    ? publishedResourceValidationSchema
    : draftResourceValidationSchema
  ).isValid(resourceFormProps)

  if (!isValid) {
    return false
  }

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

export type SearchFilterType = [
  metaProp: 'subject' | 'language' | 'level' | 'type' | 'license',
  keys: string[],
][]
export type SortType = 'Relevant' | 'Popular' | 'Recent'
export async function searchResources({
  limit = 20,
  sortType = 'Recent',
  text = '',
  after = '0',
  filters = [],
}: {
  sortType?: SortType
  text?: string
  after?: string
  limit?: number
  filters?: SearchFilterType
}) {
  const filterSortFactor =
    filters
      .filter(([, vals]) => vals.length)
      .map(
        // ([metaPropName, vals]) => `+(${currentEntityVar}.${metaPropName} IN ${toaql(vals)} ? 1 : 0)`,
        ([metaPropName, vals]) => {
          const factors: Record<SearchFilterType[number][0], number> = {
            language: 1,
            level: 0.8,
            type: 0.7,
            license: 0.9,
            subject: 0.9,
          }

          const returnExpr =
            metaPropName === 'subject'
              ? `1 / (1 + 
                ((STARTS_WITH(propVal , searchVal) || STARTS_WITH(searchVal, propVal ) )
                    ? ABS(LENGTH(propVal)-LENGTH(searchVal))
                    : 10*LEVENSHTEIN_DISTANCE(propVal,searchVal)
                ))`
              : `searchVal == propVal ? 1 : 0`

          return `${factors[metaPropName]} * AVG(
          FOR searchVal IN ${toaql(vals)}
            LET propVal = ${currentEntityVar}.${metaPropName}
            RETURN ${returnExpr}
          )
        `
        },
      )
      .join(' + ') || '1'

  const sort =
    `((${filterSortFactor}) * ` +
    (sortType === 'Popular'
      ? `${currentEntityVar}.popularity.overall) DESC, rank DESC`
      : sortType === 'Relevant'
      ? 'rank) DESC'
      : sortType === 'Recent'
      ? `${entityMeta(currentEntityVar, 'created')}) DESC`
      : 'rank) DESC')

  const skip = Number(after)

  const cursor = await shell.call(searchEntities)(
    Resource.entityClass,
    text,
    [{ name: 'title', factor: 5 }, { name: 'description' }],
    {
      limit,
      skip,
      sort,
      //preAccessBody: filter ? `SORT 100*(${filter}) DESC` : undefined,
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
