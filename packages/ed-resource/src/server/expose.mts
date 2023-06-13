import { shell } from './shell.mjs'

import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import { assertRpcFileReadable, RpcStatus, setRpcStatusCode } from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import {
  creatorUserInfoAqlProvider,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import type { Readable } from 'stream'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { ResourceRpc } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles, resourceFiles } from './init/fs.mjs'
import { getImageUrl } from './lib.mjs'
import {
  createResource,
  delResource,
  delResourceFile,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getResourceLogicalFilename,
  incrementResourceDownloads,
  patchResource,
  RESOURCE_DOWNLOAD_ENDPOINT,
  searchResources,
  setResourceContent,
  setResourceImage,
} from './services.mjs'

export type FullResourceExposeType = PkgExposeDef<ResourceExposeType & ServerResourceExposeType>

export const expose = await shell.expose<FullResourceExposeType>({
  rpc: {
    'webapp/set-is-published/:_key': {
      guard: () => void 0,
      fn: async ({ publish }, { _key }) => {
        const patchResult = await patchResource(_key, { published: publish })
        if (!patchResult) {
          return //throw ?
        }
        return
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
          return
        }
        const imageUrl = found.entity.image && getImageUrl(found.entity.image)

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
          },
          data: {
            contentType: found.entity.content?.kind ?? 'link',
            contentUrl,
            downloadFilename:
              found.entity.content?.kind === 'file'
                ? found.entity.content.fsItem.rpcFile.name
                : null,
            id: found.entity._key,
            mnUrl: getWebappUrl(getResourceHomePageRoutePath({ _key, title: found.entity.title })),
            imageUrl,
            tags: [
              {
                name: found.entity.subject,
                href: {
                  ext: true,
                  url: 'http://uis.unesco.org/en/topic/international-standard-classification-education-isced',
                },
                type: 'subject',
              },
            ], //@ETTO This need to be implemented
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
      guard: () => void 0,
      fn: async ({ values }, { _key }) => {
        const patchResult = await patchResource(_key, values)
        if (!patchResult) {
          return //throw ?
        }
        return
      },
    },
    'basic/v1/create': {
      guard: () => void 0,
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }

        const createResult = await createResource({
          description,
          title: name,
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
      guard: () => void 0,
      async fn({ file: [uploadedRpcFile] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        const patched = await setResourceImage(_key, uploadedRpcFile)
        const imageUrl = patched?.entity.image && getImageUrl(patched?.entity.image)
        return imageUrl ?? null
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/upload-content/:_key': {
      guard: () => void 0,
      async fn({ content: [uploadedContent] }, { _key }) {
        const got = await getResource(_key, { projectAccess: ['u'] })

        if (!got?.access.u) {
          throw RpcStatus('Unauthorized')
        }
        console.log({ uploadedContent })
        if (!uploadedContent) {
          await delResourceFile(_key)
          await patchResource(_key, {
            content: null,
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

        readable.on('end', () => {
          console.log('resource download stream ended, can increment download count')
          incrementResourceDownloads({ _key })
        })
        return readable
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(_, __, { limit, sortType, text, after }) {
        const { endCursor, list } = await searchResources({ limit, sortType, text, after })
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
    ): Promise<Readable>
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
