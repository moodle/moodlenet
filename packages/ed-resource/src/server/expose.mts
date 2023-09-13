import { shell } from './shell.mjs'

import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import {
  assertRpcFileReadable,
  readableRpcFile,
  RpcStatus,
  setRpcStatusCode,
} from '@moodlenet/core'
import { defaultImageUploadMaxSize, getWebappUrl } from '@moodlenet/react-app/server'
import {
  creatorUserInfoAqlProvider,
  getCurrentSystemUser,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import { boolean, object } from 'yup'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { ResourceRpc } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { env } from './init/env.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { getImageAssetInfo, getImageUrl } from './lib.mjs'
import {
  createResource,
  delResource,
  delResourceFile,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getResourceLogicalFilename,
  getResourcesCountInSubject,
  getValidations,
  incrementResourceDownloads,
  patchResource,
  RESOURCE_DOWNLOAD_ENDPOINT,
  searchResources,
  setPublished,
  setResourceContent,
  setResourceImage,
} from './services.mjs'
import type { ResourceDataType } from './types.mjs'

export type FullResourceExposeType = PkgExposeDef<ResourceExposeType & ServerResourceExposeType>

export const expose = await shell.expose<FullResourceExposeType>({
  rpc: {
    'webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        const { config } = await getValidations()
        return { validations: config }
      },
    },
    'webapp/set-is-published/:_key': {
      guard: _ =>
        object({
          publish: boolean().required(),
        }).isValid(_),
      fn: async ({ publish }, { _key }) => {
        const patchResult = await setPublished(_key, publish)
        if (!patchResult) {
          return patchResult
        }
        return true
      },
    },
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const found = await getResource(_key, {
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!found) {
          return null
        }
        const image = getImageAssetInfo(found.entity.image)

        const contentUrl = !found.entity.content
          ? null
          : found.entity.content.kind === 'file'
          ? await getResourceFileUrl({ _key, rpcFile: found.entity.content.fsItem.rpcFile })
          : found.entity.content.url

        const resourceRpc: ResourceRpc = {
          contributor: {
            avatarUrl: found.contributor.iconUrl,
            creatorProfileHref: {
              url: found.contributor.homepagePath,
              ext: false,
            },
            displayName: found.contributor.name,
            timeSinceCreation: found.meta.created,
            // avatarUrl: found.contributor?.iconUrl ?? null,
            // creatorProfileHref: {
            //   url: 'google.it',
            //   ext: true,
            // },
            // displayName: 'contributor.name',
            // timeSinceCreation: shell.now().toString(),
          },
          resourceForm: {
            description: found.entity.description,
            title: found.entity.title,
            license: found.entity.license,
            subject: found.entity.subject,
            language: found.entity.language,
            level: found.entity.level,
            month: found.entity.month,
            year: found.entity.year,
            type: found.entity.type,
            learningOutcomes: found.entity.learningOutcomes,
          },
          data: {
            contentType: found.entity.content?.kind ?? null,
            contentUrl,
            downloadFilename:
              found.entity.content?.kind === 'file'
                ? found.entity.content.fsItem.rpcFile.name
                : null,
            id: found.entity._key,
            mnUrl: getWebappUrl(getResourceHomePageRoutePath({ _key, title: found.entity.title })),
            image,
            subjectHref: found.entity.subject
              ? href(
                  getSubjectHomePageRoutePath({
                    _key: found.entity.subject,
                    title: found.entity.subject,
                  }),
                )
              : null,
          },
          state: { isPublished: found.entity.published },
          access: {
            canDelete: !!found.access.d,
            canEdit: !!found.access.u,
            canPublish: found.canPublish,
            isCreator: found.isCreator,
          },
        }

        return resourceRpc
      },
    },
    'webapp/edit/:_key': {
      guard: async body => {
        const { draftResourceValidationSchema } = await getValidations()
        body.values = await draftResourceValidationSchema.validate(body?.values, {
          stripUnknown: true,
        })
      },
      fn: async ({ values }, { _key }) => {
        const patch: Partial<ResourceDataType> = {
          description: values.description,
          language: values.language,
          learningOutcomes: values.learningOutcomes.filter(({ sentence }) => !!sentence),
          level: values.level,
          license: values.license,
          month: values.month,
          year: values.year,
          title: values.title,
          subject: values.subject,
          type: values.type,
        }
        const patchResult = await patchResource(_key, patch)
        if (!patchResult) {
          return //throw ?
        }
        return
      },
    },
    'basic/v1/create': {
      guard: async body => {
        const { draftResourceValidationSchema, draftContentValidationSchema } =
          await getValidations()
        await draftContentValidationSchema.validate({ content: body?.resource })
        await draftResourceValidationSchema.validate(body, {
          stripUnknown: true,
        })
      },
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }

        const createResult = await createResource({
          title: name,
          description,
        })

        if (!createResult) {
          throw RpcStatus('Unauthorized')
        }

        const setResourceResult = await setResourceContent(createResult._key, resourceContent)

        if (!setResourceResult) {
          await delResource(createResult._key)
          throw RpcStatus('Unauthorized')
        }

        setRpcStatusCode('Created')
        return {
          _key: createResult._key,
          description: createResult.description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: createResult._key, title: createResult.title }),
          ),
          name: createResult.title,
          url: setResourceResult.contentUrl,
        }
      },
      bodyWithFiles: {
        fields: {
          '.resource': 1,
        },
        maxSize: env.resourceUploadMaxSize,
      },
    },
    'webapp/create': {
      guard: () => void 0,
      fn: async () => {
        const createResult = await createResource({})
        if (!createResult) {
          throw RpcStatus('Unauthorized')
        }
        return {
          _key: createResult._key,
        }
      },
    },
    'webapp/delete/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const delResult = await delResource(_key)
        if (!delResult) {
          return
        }
        const imageLogicalFilename = getImageLogicalFilename(_key)
        await publicFiles.del(imageLogicalFilename)
        if (delResult.entity.content?.kind === 'file') {
          await delResourceFile(_key)
        }
        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: async body => {
        const { imageValidationSchema } = await getValidations()
        const validatedImageOrNullish = await imageValidationSchema.validate(
          { image: body?.file?.[0] },
          { stripUnknown: true },
        )
        body.file = [validatedImageOrNullish]
      },
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const updateRes = await setResourceImage(_key, uploadedRpcFile)
        if (updateRes === false) {
          throw RpcStatus('Bad Request')
        }
        if (!updateRes) {
          return null
        }
        const imageUrl = updateRes.patched.image && getImageUrl(updateRes.patched.image)
        return imageUrl
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
        maxSize: defaultImageUploadMaxSize,
      },
    },
    'webapp/upload-content/:_key': {
      guard: async body => {
        const { publishedContentValidationSchema } = await getValidations()
        const validatedContentOrNullish = await publishedContentValidationSchema.validate(
          { content: body?.content?.[0] },
          { stripUnknown: true },
        )
        body.content = [validatedContentOrNullish]
      },
      async fn({ content: [uploadedContent] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        if (got.entity.published && !uploadedContent) {
          throw RpcStatus('Precondition Failed')
        }
        // shell.log('info', { uploadedContent })
        if (!uploadedContent) {
          await delResourceFile(_key)
          await patchResource(_key, {
            content: null,
            published: false,
          })
          return null
        }
        const storeContentResult = await setResourceContent(_key, uploadedContent)
        if (!storeContentResult) {
          throw RpcStatus('Unauthorized')
        }
        return storeContentResult.contentUrl
      },
      bodyWithFiles: {
        fields: {
          '.content': 1,
        },
        maxSize: env.resourceUploadMaxSize,
      },
    },
    'webapp/get-resources-count-in-subject/:subjectKey': {
      guard: () => void 0,
      async fn(_, { subjectKey }) {
        const count = await getResourcesCountInSubject({ subjectKey })
        return count ?? { count: 0 }
      },
    },
    [RESOURCE_DOWNLOAD_ENDPOINT]: {
      guard: () => void 0,
      async fn(_, { _key }: { _key: string }) {
        const resourceLogicalFilename = getResourceLogicalFilename(_key)
        const fsItem = await resourceFiles.get(resourceLogicalFilename)
        if (!fsItem) {
          throw RpcStatus('Not Found')
        }
        const readable = await assertRpcFileReadable(fsItem.rpcFile)

        readable.on('end', async () => {
          const currentSysUser = await getCurrentSystemUser()
          shell.events.emit('resource:downloaded', { resourceKey: _key, currentSysUser })
          incrementResourceDownloads({ _key })
        })
        return readableRpcFile({ ...fsItem.rpcFile }, () => readable)
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(body = {}, __, { limit, sortType, text, after }) {
        const { filters } = body
        const { endCursor, list } = await searchResources({
          limit,
          sortType,
          text,
          after,
          filters,
        })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})

type ServerResourceExposeType = {
  rpc: {
    [RESOURCE_DOWNLOAD_ENDPOINT](
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
    'basic/v1/create'(body: {
      name: string
      description: string
      resource: string | [RpcFile]
    }): Promise<{
      _key: string
      name: string
      description: string
      url: string
      homepage: string
    }>
  }
}
