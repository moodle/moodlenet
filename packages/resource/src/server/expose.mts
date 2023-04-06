import { shell } from './shell.mjs'

import { RpcFile, RpcStatus } from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { creatorUserInfoAqlProvider, isCreator } from '@moodlenet/system-entities/server/aql-ac'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import { ResourceExposeType } from '../common/expose-def.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { publicFiles, publicFilesHttp, resourceFiles } from './init.mjs'
import {
  createResource,
  delResource,
  getImageLogicalFilename,
  getResource,
  getResourceFileUrl,
  getResourceLogicalFilename,
  patchResource,
  RESOURCE_DOWNLOAD_ENDPOINT,
  storeResourceFile,
} from './lib.mjs'
import { ResourceDataType } from './types.mjs'

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
        return {
          contributor: {
            avatarUrl: found.contributor.iconUrl,
            creatorProfileHref: {
              url: found.contributor.homepagePath,
              ext: false,
            },
            displayName: found.contributor.name,
            timeSinceCreation:
              '___________________________________________________________________________________________',
          },
          resourceForm: { description: found.entity.description, title: found.entity.title },
          data: {
            contentType: 'file', // -----------------------------------------------
            contentUrl: '___________________________________________________________',
            downloadFilename: '___________________________________________________________',
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
        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: () => void 0,
      async fn({ file: [file] }, { _key }) {
        const imageLogicalFilename = getImageLogicalFilename(_key)

        const { directAccessId } = await publicFiles.store(imageLogicalFilename, file)

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
        { content: [content] }: { content: [RpcFile | string] },
        { _key }: { _key: string },
      ) {
        const isUrlContent = typeof content === 'string'
        const contentUrl = isUrlContent ? content : getResourceFileUrl({ _key, rpcFile: content })
        const contentProp: ResourceDataType['content'] = isUrlContent
          ? {
              kind: 'url',
              url: content,
            }
          : {
              kind: 'file',
              rpcFile: (await storeResourceFile(_key, content)).rpcFile,
            }
        await patchResource(_key, { content: contentProp })

        return contentUrl
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
