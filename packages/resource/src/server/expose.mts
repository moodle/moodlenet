import { ResourceFormRpc, ResourceRpc } from '../common.mjs'
import { shell } from './shell.mjs'

import { RpcFile, RpcStatus } from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { creatorUserInfoAqlProvider, isCreator } from '@moodlenet/system-entities/server/aql-ac'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import {
  createResource,
  delResource,
  getImageUrl,
  getResource,
  patchResource,
  storeContentFile,
  storeImageFile,
} from './lib.mjs'

export const expose = await shell.expose({
  rpc: {
    'webapp/set-is-published/:_key': {
      guard: () => void 0,
      fn: async ({ publish }: { publish: boolean }, { _key }: { _key: string }) => {
        console.log({ _key, publish })
        //  await setIsPublished(key, publish)
      },
    },
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }: { _key: string }): Promise<ResourceRpc | undefined> => {
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
            imageUrl: getImageUrl(_key),
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
      fn: async (
        { values }: { values: ResourceFormRpc },
        { _key }: { _key: string },
      ): Promise<void> => {
        const patchResult = await patchResource(_key, values)
        if (!patchResult) {
          return //throw ?
        }
        return
      },
    },
    'webapp/create': {
      guard: () => void 0,
      fn: async (): Promise<{ _key: string }> => {
        const createResult = await createResource({ description: '', title: '' })
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
      fn: async (_, { _key }: { _key: string }): Promise<void> => {
        const delResult = await delResource(_key)
        if (!delResult) {
          return
        }
        return
      },
    },
    'webapp/upload-image/:_key': {
      guard: () => void 0,
      async fn({ file }: { file: RpcFile }, { _key }: { _key: string }) {
        await storeImageFile(_key, file)
        return ''
      },
    },
    'webapp/upload-content/:_key': {
      guard: () => void 0,
      async fn({ content }: { content: RpcFile | string }, { _key }: { _key: string }) {
        if (typeof content === 'string') {
          return content
        }
        await storeContentFile(_key, content)
        return ''
      },
    },
  },
})
