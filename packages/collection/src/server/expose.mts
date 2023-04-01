import { CollectionDataResponce, CollectionFormValues } from '../common.mjs'
import { mockModel } from './mockLib.mjs'
import { shell } from './shell.mjs'

type KeyId = { key: string }
const { get, _delete, edit, toggleFollow, setIsPublished, toggleBookmark, setImage } = mockModel

// good for export in file name controller if code grow
const rpcCtrl = {
  get: async (_body: any, params: { _key: string }, _query: string | undefined) =>
    await get(params._key, _query),
  edit: async ({ key, values }: { key: string; values: CollectionFormValues }) =>
    await edit(key, values),
  toggleFollow: async ({ key }: KeyId) => await toggleFollow(key),
  setIsPublished: async ({ key, publish }: { key: string; publish: boolean }) =>
    await setIsPublished(key, publish),
  toggleBookmark: async ({ key }: KeyId) => await toggleBookmark(key),
  setImage: async ({ key, file }: KeyId & { file: File }) => await setImage(key, file),
  create: async (): Promise<CollectionDataResponce> =>
    new Promise(resolve => resolve(mockModel.empityFormModel)),
  _delete: async ({ key }: KeyId) => await _delete(key),
}

const guards = { noCheck: () => void 0 }
const { noCheck } = guards
export const expose = await shell.expose({
  rpc: {
    'webapp/get/:_key': { guard: noCheck, fn: rpcCtrl.get },
    'webapp/edit': { guard: noCheck, fn: rpcCtrl.edit },
    'webapp/delete': { guard: noCheck, fn: rpcCtrl._delete },
    'webapp/toggleFollow': { guard: noCheck, fn: rpcCtrl.toggleFollow },
    'webapp/setIsPublished': { guard: noCheck, fn: rpcCtrl.setIsPublished },
    'webapp/toggleBookmark': { guard: noCheck, fn: rpcCtrl.toggleBookmark },
    'webapp/setImage': { guard: noCheck, fn: rpcCtrl.setImage },
    'webapp/create': { guard: noCheck, fn: rpcCtrl.create },
  },
})
