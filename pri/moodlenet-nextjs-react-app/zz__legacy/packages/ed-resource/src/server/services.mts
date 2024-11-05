import type { RpcFile } from '@moodlenet/core'
import type { ImageEdit } from '@moodlenet/core-domain/resource'
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
import type { ValidationsConfig } from '../common/validationSchema.mjs'
import { getValidationSchemas } from '../common/validationSchema.mjs'
import { env } from './init/env.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { Resource } from './init/sys-entities.mjs'
import { shell } from './shell.mjs'
import type { ResourceDataType } from './types.mjs'

export const validationsConfigs: ValidationsConfig = {
  contentMaxUploadSize: env.resourceUploadMaxSize,
  imageMaxUploadSize: defaultImageUploadMaxSize,
  titleLength: {
    min: 3,
    max: 160,
  },
  descriptionLength: {
    min: 40,
    max: 4000,
  },
  learningOutcomes: {
    amount: { min: 1, max: 5 },
    sentenceLength: { min: 3, max: 160 },
  },
}
export async function getValidations() {
  const {
    draftResourceValidationSchema,
    publishedResourceValidationSchema,
    contentValidationSchema,
    imageValidationSchema,
  } = getValidationSchemas(validationsConfigs)

  return {
    contentValidationSchema,
    draftResourceValidationSchema,
    publishedResourceValidationSchema,
    imageValidationSchema,
    config: validationsConfigs,
  }
}

// export async function setPublished(key: string, published: boolean) {
//   let matchRev: string | undefined = undefined
//   if (published) {
//     const resource = await shell.call(getEntity)(Resource.entityClass, key)
//     if (!resource) {
//       return null
//     }
//     if (!resource.entity.content) {
//       return false
//     }

//     const { publishedResourceValidationSchema } = await getValidations()
//     const resourceFormProps: ResourceFormProps = {
//       description: resource.entity.description,
//       title: resource.entity.title,
//       language: resource.entity.language,
//       level: resource.entity.level,
//       license: resource.entity.license,
//       subject: resource.entity.subject,
//       type: resource.entity.type,
//       month: resource.entity.month,
//       year: resource.entity.year,
//       learningOutcomes: resource.entity.learningOutcomes,
//     }
//     const isValid = await publishedResourceValidationSchema.isValid(resourceFormProps)
//     if (!isValid) {
//       return false
//     }
//     matchRev = resource.entity._rev
//   }
//   const patchResult = await shell.call(patchEntity)(
//     Resource.entityClass,
//     key,
//     { published },
//     {
//       matchRev,
//       preAccessBody: published ? `FILTER ${canPublish()}` : undefined,
//     },
//   )
//   if (!patchResult) {
//     return
//   }
//   return patchResult
// }
export const EMPTY_RESOURCE: Omit<ResourceDataType, 'content' | 'persistentContext'> = {
  description: '',
  title: '',
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
}
export async function createResource(
  resourceData: Partial<ResourceDataType & { _key: string }>,
  content: ResourceDataType['content'],
) {
  const newResource = await shell.call(create)(Resource.entityClass, {
    ...EMPTY_RESOURCE,
    ...resourceData,
    content,
    persistentContext: {
      state: 'Storing-New-Resource',
      generatedData: null,
    },
  })
  if (!newResource) return
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

async function deltaResourcePopularityItem({
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

export async function patchResource(_key: string, patch: Partial<ResourceDataType>) {
  // const resource = await shell.call(getEntity)(Resource.entityClass, _key)
  // if (!resource) {
  //   return null
  // }
  // const { draftResourceValidationSchema, publishedResourceValidationSchema } =
  //   await getValidations()
  // const resourceFormProps: ResourceFormProps = {
  //   description: patch.description ?? resource.entity.description,
  //   title: patch.title ?? resource.entity.title,
  //   language: patch.language ?? resource.entity.language,
  //   level: patch.level ?? resource.entity.level,
  //   license: patch.license ?? resource.entity.license,
  //   month: patch.month ?? resource.entity.month,
  //   subject: patch.subject ?? resource.entity.subject,
  //   type: patch.type ?? resource.entity.type,
  //   year: patch.year ?? resource.entity.year,
  //   learningOutcomes: patch.learningOutcomes ?? resource.entity.learningOutcomes,
  // }
  // const isValid = await (resource.entity.published
  //   ? publishedResourceValidationSchema
  //   : draftResourceValidationSchema
  // ).isValid(resourceFormProps)

  // if (!isValid) {
  //   return false
  // }

  const patchResult = await shell.call(patchEntity)(Resource.entityClass, _key, patch)
  if (!patchResult) return

  return patchResult
}

export async function delResource(_key: string) {
  const delResult = await shell.call(delEntity)(Resource.entityClass, _key)
  if (!delResult) return
  return delResult
}

export function getImageLogicalFilename(resourceKey: string) {
  return `image/${resourceKey}`
}

export async function storeResourceFile(resourceKey: string, imageRpcFile: RpcFile) {
  const resourceLogicalFilename = getResourceLogicalFilename(resourceKey)

  const fsItem = await resourceFiles.store(resourceLogicalFilename, imageRpcFile)

  return fsItem
}

export async function getResourceFile(resourceKey: string) {
  const resourceLogicalFilename = getResourceLogicalFilename(resourceKey)
  const fsItem = await resourceFiles.get(resourceLogicalFilename)
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

export async function updateImage(
  resourceKey: string,
  imageEdit: ImageEdit | undefined,
  opts?: {
    noResize?: boolean
  },
) {
  if (imageEdit?.kind === 'no-change') return true as const

  const imagePatch: ResourceDataType['image'] | undefined =
    imageEdit?.kind === 'file'
      ? {
          kind: 'file',
          directAccessId: await (async () => {
            const imageLogicalFilename = getImageLogicalFilename(resourceKey)
            const resizedRpcFile = opts?.noResize
              ? imageEdit.rpcFile
              : await webImageResizer(imageEdit.rpcFile, 'image')

            const saveFileResp = await publicFiles.store(imageLogicalFilename, resizedRpcFile)
            return saveFileResp.directAccessId
          })(),
        }
      : imageEdit?.kind === 'remove'
        ? (await deleteImageFile(resourceKey), null)
        : imageEdit?.kind === 'url'
          ? { kind: 'url', url: imageEdit.url, credits: imageEdit.credits }
          : !imageEdit
            ? undefined
            : (() => {
                throw new TypeError('never')
              })()

  const patchResult = await patchResource(resourceKey, {
    image: imagePatch,
  })
  if (!patchResult) {
    return patchResult
  }
  return patchResult
}

export function deleteImageFile(_key: string) {
  return publicFiles.del(getImageLogicalFilename(_key))
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
  strictFilters,
}: {
  sortType?: SortType
  text?: string
  after?: string
  limit?: number
  filters?: SearchFilterType
  strictFilters: boolean
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
              ? `! propVal
              ? 0 
              : 1 / (1 + 
                ((STARTS_WITH(propVal , searchVal) || STARTS_WITH(searchVal, propVal ) )
                    ? ABS(LENGTH(propVal)-LENGTH(searchVal)) 
                    : 10 * LEVENSHTEIN_DISTANCE(propVal,searchVal)
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

  const filter = strictFilters
    ? filters
        .filter(([, vals]) => vals.length)
        .map(([metaPropName, vals]) => {
          return `(${currentEntityVar}.${metaPropName} IN ${toaql(vals)} )`
        })
        .join(' && ')
    : undefined

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
      preAccessBody: filter ? `FILTER ( ${filter} )` : undefined,
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
