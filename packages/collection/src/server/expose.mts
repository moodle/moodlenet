import { CollectionFormRpc, CollectionRpc } from '../common.mjs'
import { shell } from './shell.mjs'

import { RpcFile, RpcStatus } from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { creatorUserInfoAqlProvider, isCreator } from '@moodlenet/system-entities/server/aql-ac'
// import { CollectionDataResponce, CollectionFormValues } from '../common.mjs'
import { getCollectionHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import {
  createCollection,
  delCollection,
  getCollection,
  getImageUrl,
  patchCollection,
  storeImageFile,
} from './lib.mjs'
// import { mockModel } from './mockLib.mjs'

// type KeyId = { key: string }
// type KeyValue = { key: string; values: CollectionFormRpc }
// type KeyFile = { key: string; file: File }
// type keyBoolean = { key: string; publish: boolean }
// type Result = Parameters<(a: { _key: string } | null, b?: { _key: string }) => CollectionFormRpc>

// good for export in file name controller if code grow
// const rpcCtrl = {
//   // RpcArgs accepts 3 arguments : body(an object), url-params:(Record<string,string> ), and an object(Record<string,string>) describing query-string
//   get: async (...args: Result) =>
//     await get((args[0]?._key ? args[0]?._key : args[1]?._key) || '-1'),
//   edit: async ({ key, values }: KeyValue) => await edit(key, values),
//   setIsPublished: async ({ key, publish }: keyBoolean) => await setIsPublished(key, publish),
//   setImage: async ({ key, file }: KeyFile) => await setImage(key, file),
//   create: async () => await create(),
//   delete: async ({ key }: KeyId) => await _delete(key),
//   // toggleFollow: async ({ key }: KeyId) => await toggleFollow(key), // toggleBookmark: async ({ key }: KeyId) => await toggleBookmark(key),
// }

// const guards = { noCheck: () => void 0 }
// const { noCheck } = guards
export const expose = await shell.expose({
  rpc: {
    // 'webapp/get/:_key': { guard: noCheck, fn: rpcCtrl.get },
    // 'webapp/edit': { guard: noCheck, fn: rpcCtrl.edit },
    // 'webapp/delete': { guard: noCheck, fn: rpcCtrl.delete },
    // 'webapp/setIsPublished': { guard: noCheck, fn: rpcCtrl.setIsPublished },
    // 'webapp/setImage': { guard: noCheck, fn: rpcCtrl.setImage },
    // 'webapp/create': { guard: noCheck, fn: rpcCtrl.create },
    //'webapp/toggleBookmark': { guard: noCheck, fn: rpcCtrl.toggleBookmark },// 'webapp/toggleFollow': { guard: noCheck, fn: rpcCtrl.toggleFollow },

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
      fn: async ({ key, publish }: { key: string; publish: boolean }) => {
        console.log({ key, publish })
        //  await setIsPublished(key, publish)
      },
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
      fn: async (_, { _key }: { _key: string }): Promise<CollectionRpc | undefined> => {
        const found = await getCollection(_key, {
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
          },

          form: { description: found.entity.description, title: found.entity.title },
          data: {
            collectionId: found.entity._key,
            mnUrl: getWebappUrl(getCollectionHomePageRoutePath({ _key })),
            imageUrl: getImageUrl(_key),
            isWaitingForApproval: false,
          },
          state: { isPublished: true, numResources: 0 },
          access: {
            canDelete: !!found.access.d,
            canEdit: !!found.access.u,
            canPublish: found.canPublish,
            isCreator: found.isCreator,
          },
        }
      },
    },
    'webapp/edit': {
      guard: () => void 0,
      fn: async ({ key, values }: { key: string; values: CollectionFormRpc }): Promise<void> => {
        const patchResult = await patchCollection(key, values)
        if (!patchResult) {
          return
        }
        return
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
