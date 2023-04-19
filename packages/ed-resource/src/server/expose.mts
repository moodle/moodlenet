import { shell } from './shell.mjs'

import { RpcFile, RpcStatus, setRpcStatusCode } from '@moodlenet/core'
import { getWebappUrl, webImageResizer } from '@moodlenet/react-app/server'
import { creatorUserInfoAqlProvider, isCreator } from '@moodlenet/system-entities/server/aql-ac'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import { ResourceRpc } from '../common.mjs'
import { ResourceExposeType } from '../common/expose-def.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles, publicFilesHttp, resourceFiles } from './init.mjs'
import {
  createResource,
  delResource,
  delResourceFile,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getResourceLogicalFilename,
  patchResource,
  RESOURCE_DOWNLOAD_ENDPOINT,
  setResourceContent,
} from './lib.mjs'

export const expose = await shell.expose<ResourceExposeType>({
  rpc: {
    'webapp/set-is-published/:_key': {
      guard: () => void 0,
      fn: async ({ publish }, { _key }) => {
        console.log({ _key, publish })
        //  await setIsPublished(key, publish)
      },
    },
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const found = await getResource(_key, {
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
            isCreator: isCreator(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!found) {
          return
        }
        const imageUrl = found.entity.image
          ? publicFilesHttp.getFileUrl({ directAccessId: found.entity.image.directAccessId })
          : ''

        const contentUrl = !found.entity.content
          ? null
          : found.entity.content.kind === 'file'
          ? await getResourceFileUrl({ _key, rpcFile: found.entity.content.fsItem.rpcFile })
          : found.entity.content.url

        console.log({ found })
        const resourceRpc: ResourceRpc = {
          contributor: {
            avatarUrl: found.contributor.iconUrl,
            creatorProfileHref: {
              url: found.contributor.homepagePath,
              ext: false,
            },
            displayName: found.contributor.name,
            timeSinceCreation: found.meta.created,
          },
          resourceForm: { description: found.entity.description, title: found.entity.title },
          data: {
            contentType: found.entity.content?.kind ?? 'link',
            contentUrl,
            downloadFilename:
              found.entity.content?.kind === 'file'
                ? found.entity.content.fsItem.rpcFile.name
                : null,
            resourceId: found.entity._key,
            mnUrl: getWebappUrl(getResourceHomePageRoutePath({ _key })),
            imageUrl,
            isWaitingForApproval: false,
          },
          state: { isPublished: true },
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
          content: null,
          image: null,
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
          homepage: getWebappUrl(getResourceHomePageRoutePath({ _key: createResult._key })),
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
        const createResult = await createResource({
          description: '',
          title: '',
          content: null,
          image: null,
        })
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
        const imageLogicalFilename = getImageLogicalFilename(_key)

        const resizedRpcFile = await webImageResizer(uploadedRpcFile, 'image')

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, resizedRpcFile)

        await patchResource(_key, {
          image: { kind: 'file', directAccessId },
        })
        return publicFilesHttp.getFileUrl({ directAccessId })
      },
      bodyWithFiles: {
        fields: {
          '.file': 1,
        },
      },
    },
    'webapp/upload-content/:_key': {
      guard: () => void 0,
      async fn(
        { content: [uploadedContent] }: { content: [RpcFile | string] },
        { _key }: { _key: string },
      ) {
        // const got = await getResource(_key, { projectAccess: ['u'] })

        // if (!got?.access.u) {
        //   throw RpcStatus('Unauthorized')
        // }
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
        return fsItem.rpcFile
      },
    },
  },
})
