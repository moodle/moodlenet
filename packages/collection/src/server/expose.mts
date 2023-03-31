import { RpcFile, RpcStatus } from '@moodlenet/core'
import { CollectionDataResponce, CollectionFormValues } from '../common.mjs'
import {
  createCollection,
  delCollection,
  getCollection,
  patchCollection,
  storeImageFile,
} from './lib.mjs'
import { mockModel } from './mockLib.mjs'
import { shell } from './shell.mjs'

const { setIsPublished } = mockModel

export const expose = await shell.expose({
  rpc: {
    // 'webapp/get/:_key': {
    //   guard: () => void 0,
    //   fn: async (_body, params, _query) => await get(params._key, _query),
    // },
    // 'webapp/edit': {
    //   guard: () => void 0,
    //   fn: async ({ key, values }: { key: string; values: CollectionFormValues }) =>
    //     await edit(key, values),
    // },
    // 'webapp/delete': {
    //   guard: () => void 0,
    //   fn: async ({ key }: KeyId) => await _delete(key),
    // },
    'webapp/setIsPublished': {
      guard: () => void 0,
      fn: async ({ key, publish }: { key: string; publish: boolean }) =>
        await setIsPublished(key, publish),
    },
    // 'webapp/setImage': {
    //   guard: () => void 0,
    //   fn: async ({ key, file }: KeyId & { file: File }) => await setImage(key, file),
    // },
    // 'webapp/create': {
    //   guard: () => void 0,
    //   fn: async (): Promise<CollectionDataResponce> =>
    //     new Promise(resolve => resolve(mockModel.empityFormModel)),
    // },
    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, params: { _key: string }): Promise<CollectionDataResponce | undefined> => {
        const found = await getCollection(params._key, { projectAccess: ['u', 'r'] })
        if (!found) {
          return
        }
        return {
          contributor: {
            _key: (found.creator as any)._key,
            avatarUrl: '',
            creatorProfileHref: { url: '', ext: false },
            displayName: '',
          },
          form: { description: found.entity.description, title: found.entity.title },
          data: {
            collectionId: found.entity._key,
            mnUrl: '',
            imageUrl: '',
            isWaitingForApproval: false,
          },
          state: { isPublished: true, numResources: 0 },
          access: {
            canDelete: !!found.access.d,
            canEdit: !!found.access.u,
            canPublish: true,
          },
        }
      },
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async ({
        key,
        values,
      }: {
        key: string
        values: CollectionFormValues
      }): Promise<undefined | CollectionFormValues> => {
        const patchResult = await patchCollection(key, values)
        if (!patchResult) {
          return
        }
        return {
          description: patchResult.entity.description,
          title: patchResult.entity.title,
        }
      },
    },
    'webapp/create': {
      guard: () => void 0,
      fn: async (): Promise<{ _key: string }> => {
        const createResult = await createCollection({ description: '', title: '' })
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
        const delResult = await delCollection(_key)
        if (!delResult) {
          return
        }
        return
      },
    },
    'webapp/collection/:_key/uploadImage': {
      guard: () => void 0,
      async fn({ file }: { file: RpcFile }, { _key }: { _key: string }) {
        await storeImageFile(_key, file)
      },
    },
  },
})
